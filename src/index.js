/*jshint esnext: true */
import React, {
    Component , PropTypes
}
from 'react';
import Github from "github-api";
import Promise from 'bluebird';

import ReactDOM from 'react-dom';
import Moment from 'moment';
import ReactDataGrid from 'react-data-grid/addons';
var Toolbar = ReactDataGrid.Toolbar;

// global error handler
window.onerror = function(msg, url, line, col, error) {
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;

    // You can view the information in an alert to see things working like this:
    //    alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

    var suppressErrorAlert = true;
    // If you return true, then error alerts (like in older versions of
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
};

//Custom Formatter component
var LinkFormatter = React.createClass({
    render: function () {
        return ( < a href = {
                this.props.value
                }
                target = "blank" > (link) < /a>
        );
    }
});
const columns = [
    {
        key: "name",
        name: "Name",
        location: 'item',
        width: 300,
        resizable: true,
        datatype: 'string',
        filterable: true
    },
    {
        key: "private",
        name: "IsPrivate",
        location: 'item',
        width: 80,
        resizable: true,
        datatype: 'boolean',
        filterable: true
    },
    {
        key: "fork",
        name: "IsFork",
        location: 'item',
        width: 80,
        resizable: true,
        datatype: 'boolean',
        filterable: true
    },
    {
        key: "html_url",
        name: "URL",
        location: 'item',
        width: 50,
        datatype: 'http_url',
        formatter: LinkFormatter
    },
    {
        key: "html_url",
        name: "Forked From",
        location: 'item.parent',
        width: 50,
        datatype: 'http_url',
        formatter: LinkFormatter
    },
    {
        key: "created_at",
        name: "created",
        location: 'item',
        width: 130,
        resizable: true,
        datatype: 'utc-date-string',
        filterable: true
    },
    {
        key: "updated_at",
        name: "Updated",
        location: 'item',
        width: 130,
        resizable: true,
        datatype: 'utc-date-string',
        filterable: true
    },
    {
        key: "description",
        name: "Description",
        location: 'item',
        width: 800,
        resizable: true,
        datatype: 'string',
        filterable: true
    }];

class RepoGrid extends Component {
    constructor() {
        super();
        //    console.log(this.props);
        this.state = {
            rows: [],
            user: {},
            filter: {}
        };
        this.state.github = new Github({
            token: "731e3848d86442d643952e462f5b77154fee9c6f",
            auth: "oauth"
        });

        this.getUserDetails()
            .then(function (user) {
            this.setState({
                user: user
            });
            return Promise.resolve(user);
        }.bind(this))
            .catch(function (err) {
            console.log(err);
        }.bind(this));

        this.getRepos()
            .then(function (repos) {
            return Promise.mapSeries(repos.slice(0, 20), this.getRepoDetails.bind(this))
                .then(function (repos) {
                var reformatted = this.reformat(repos);
                //            console.log(reformatted);
                this.setState({
                    rows: reformatted,
                    originalRows: reformatted.slice(0)
                });
                console.log(this);
            }.bind(this))
        }.bind(this))
            .catch(function (err) {
            console.log(err);
        }.bind(this));
    }

    reformat(rows) {
        console.log('in reformat function');
//        console.log(columns);
        var a = rows.map(function (item) {
            var row={};
            columns.forEach(function(col) {
                switch (col.datatype) {
                    case 'string':
                        row[col.key] = item[col.key];
                        console.log(col.key,row[col.key],item[col.key])
                        break;
                    case 'utc-date-string':
                        row[col.key] = Moment.utc(item[col.key]).format('L');
                        console.log(col.key,row[col.key],item[col.key])
                        break;
                    case 'boolean':
                        row[col.key] = item[col.key].toString();
                        console.log(col.key,row[col.key],item[col.key])
                        break;
                    case 'http_url':
                        row[col.key] = item[col.key];
                        col.formatter = LinkFormatter;
                        console.log(col.key,row[col.key],item[col.key])
                        break;
                    default:
                        // log and ignore
                        console.log('unknown col.datatype: ', col.datatype);
                        break;
                }
            });
            console.log(row);
            return row;
        });
        return a;
    }

    getRepoDetails(basicRepo) {
        var repo = Promise.promisifyAll(
            this.state.github.getRepo(
                basicRepo.owner.login,
                basicRepo.name
            )
        );
        //    console.log(repo);
        return repo.showAsync()
            .then(function (details) {
            return details;
        }.bind(this)
                 );
    }
    getUserDetails() {
        var user = Promise.promisifyAll(this.state.github.getUser());
        //    console.log(user);
        return user.showAsync(null)
            .then(function (userData) {
            //        console.log(userData);
            return userData;
        }.bind(this)
                 );
    }
    getRepos() {
        var user = Promise.promisifyAll(this.state.github.getUser());
        //    console.log(user);
        return user.reposAsync({
            type: "owner"
        })
            .then(function (repos) {
            return repos.slice(0, 19);
        }.bind(this));
    }
    getSize() {
        if (!this) {console.log('in the getSize method and no this defined')}
        if (this.state && this.state.rows) {
            return this.state.rows.length;
        } else {
            return 0;
        }
    }

    getRowAt(index) {
        //      console.log(this);
        if (this || this.state && this.state.rows) {
        }
        if (index < 0 || index > this.state.rows.length) {
                return undefined;
        }
            return this.state.rows[index];
    }
    filterRows(originalRows, filters) {
        var rows = originalRows.filter(function (r) {
            var include = true;
            for (var columnKey in filters) {
                if (filters.hasOwnProperty(columnKey)) {
                    var rowValue = r[columnKey].toString().toLowerCase();
                    if (rowValue.indexOf(filters[columnKey].toLowerCase()) === -1) {
                        include = false;
                    }
                }
            }
            return include;
        }.bind(this));
        return rows;
    }
    handleFilterChange(filter) {
        this.setState(function (currentState) {
            //        console.log(currentState);
            if (filter.filterTerm) {
                currentState.filters[filter.columnKey] = filter.filterTerm;
            } else {
                delete currentState.filters[filter.columnKey];
            }
            currentState.rows = this.filterRows(currentState.originalRows, currentState.filters);
            return currentState;
        });
    }
    render() {
        return (
            < ReactDataGrid columns = {
            columns
            }
            rowGetter = {
            this.getRowAt.bind(this)
            }
            rowsCount = {
            this.getSize()
    }
    minHeight = {
        500
    }
    toolbar = { < Toolbar
               enableFilter = {
               true
              }
    onToggleFilter = {
        () => {}
}
numberOfRows = {
    this.getSize()
}
/>
}
onAddFilter = {
    this.handleFilterChange
}
/>
);
}
}

ReactDOM.render( < RepoGrid / > , document.getElementById('grid'));
