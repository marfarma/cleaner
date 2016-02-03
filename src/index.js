/*global
Buffer, clearImmediate, clearInterval, clearTimeout, console, exports, global, module, process, querystring, require, setImmediate, setInterval, setTimeout, __dirname, __filename
*/
/*jshint esnext: true */

import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import fakeData from './test-data.js';
import ReactDataGrid from 'react-data-grid/addons';
var Toolbar = ReactDataGrid.Toolbar;
//import FacetedSearch from './components/faceted-search';


var reformattedArray = fakeData.map(function(obj){
  var rObj = {};
  for (var p in obj) {
    if (typeof obj[p] === 'boolean') {
      rObj[p] = obj[p].toString();
    } else {
      rObj[p] = obj[p];
    }
    rObj.created_at = Moment.utc(obj.created_at).format('L');
    rObj.updated_at = Moment.utc(obj.updated_at).format('L');
  }
  return rObj;
});


//console.log ('fakeData: ', fakeData[0].fork, " ", typeof fakeData[0].fork);
//console.log ('reformattedArray: ', reformattedArray[0].fork, " ", typeof reformattedArray[0].fork);




// convert created & modified strings to moment date objects
// loop through array and get full repo data if forked - pick out origin repo
//Custom Formatter component
var LinkFormatter = React.createClass({
  render:function(){
//    console.log(this.props);
    return (
      <a href={this.props.value} target="blank">(link)</a>
    );
  }
});




const columns = [
//  {
//    key: "id",
//    name: "ID",
//    width : 80,
//    resizable: true
//
//  },
  {
  key: "name",
    name: "Name",
    width : 300,
    resizable: true,
    filterable: true

}, {
  key: "private",
  name: "IsPrivate",
  width : 80,
  resizable: true,
  filterable: true

},
  {
  key: "fork",
  name: "IsFork",
  width : 80,
    resizable: true,
    filterable: true

}, {
  key: "html_url",
  name: "URL",
  width : 50,
  formatter : LinkFormatter

}, {
  key: "created_at",
  name: "created",
  width : 130,
  resizable: true,
  filterable: true

}, {
  key: "updated_at",
  name: "Updated",
  width : 130,
  resizable: true,
  filterable: true

},
    {
    key: "description",
      name: "Description",
      width : 800,
      resizable: true,
      filterable: true

  },
  //  key: "git_url",
//  name: "Git URL"
//}, {
//  key: "ssh_url",
//  name: "SSH URL"
//}, {
//  key: "homepage",
//  name: "Homepage"
//}, {
//  key: "size",
//  name: "Size"
//}, {
//  key: "stargazers_count",
//  name: "Stars #"
//}, {
//  key: "watchers_count",
//  name: "Watchers #"
//}, {
//  key: "language",
//  name: "Language"
//}, {
//  key: "has_issues",
//  name: "Has Issues"
//}, {
//  key: "has_downloads",
//  name: "Has Downloads"
//}, {
//  key: "has_wiki",
//  name: "Has Wiki"
//}, {
//  key: "has_pages",
//  name: "Has Pages"
//}, {
//  key: "forks_count",
//  name: "# Forks"
//}, {
//  key: "open_issues_count",
//  name: "# Open Issues"
//}, {
//  key: "forks",
//  name: "# Forks"
//}, {
//  key: "open_issues",
//  name: "# Open Issues"
//}, {
//  key: "watchers",
//  name: "# Watchers"
//}, {
//  key: "default_branch",
//  name: "Default Branch"
//}

];


var Example = React.createClass(
  {
  displayName: 'component',

    getInitialState : function(){
      var originalRows = reformattedArray.slice(0);
      return (//{rows :reformattedArray};
      {originalRows :originalRows, rows :reformattedArray, filters :{}}
    )
    },

  getRowAt: function (index) {
    if (index < 0 || index > this.getSize()) {
      return undefined;
    }
    return this.state.rows[index];
  },
  getSize: function () {
    return this.state.rows.length;
  },
    filterRows : function(originalRows, filters) {
      var rows = originalRows.filter(function(r){
        var include = true;
        for (var columnKey in filters) {
          if(filters.hasOwnProperty(columnKey)) {
            var rowValue = r[columnKey].toString().toLowerCase();
            if(rowValue.indexOf(filters[columnKey].toLowerCase()) === -1) {
              include = false;
            }
          }
        }
        return include;
      });
      return rows;
    },
    handleToggleChange : function(){
      console.log('in toggle change callback');
      this.setState(function(currentState) {
        currentState.filters = {};
        currentState.rows = this.filterRows(currentState.originalRows, currentState.filters);
        return currentState;
      });
    },
    handleFilterChange : function(filter){
      console.log('in handleFilterChange callback');
      this.setState(function(currentState) {
//        console.log(currentState);
        if (filter.filterTerm) {
          currentState.filters[filter.columnKey] = filter.filterTerm;
        } else {
          delete currentState.filters[filter.columnKey];
        }
        currentState.rows = this.filterRows(currentState.originalRows, currentState.filters);
        return currentState;
      });
    },
  render: function () {
    return ( < ReactDataGrid
      columns = {
        columns
      }
      rowGetter = {
        this.getRowAt
      }
      rowsCount = {
        this.getSize()
      }
      minHeight={500}
      toolbar={<Toolbar enableFilter={true}
        onToggleFilter={this.handleToggleChange}
        onToggleFilter= {() => {}}
      numberOfRows={this.getSize()}/>}
      onAddFilter={this.handleFilterChange}

  //      enableRowSelect = {
//        true
//      }
      />
    );
  }
});

ReactDOM.render(<Example />, document.getElementById('grid'));


//ReactDOM.render(<App />,document.querySelector('.container'));
//ReactDOM.render( < Griddle results = {
//    fakeData
//  }
//  showFilter = {
//    true
//  }
//  showSettings = {
//    false
//  }
//  resultsPerPage = {
//    10
//  }
//  columns = {
//    [
//    "id",
//    "name",
//    "private",
//    "description",
//    "fork",
//    "url",
//    "created_at",
//    "updated_at",
//    "pushed_at",
//    "git_url",
//    "ssh_url",
//    "clone_url",
//    "svn_url",
//    "homepage",
//    "size",
//    "stargazers_count",
//    "watchers_count",
//    "language",
//    "has_issues",
//    "has_downloads",
//    "has_wiki",
//    "has_pages",
//    "forks_count",
//    "mirror_url",
//    "open_issues_count",
//    "forks",
//    "open_issues",
//    "watchers",
//    "default_branch"
//    ]
//  }
//  />,
//  document.getElementById('griddle-basic'));


// USER=marfarma; curl "https://api.github.com/users/$USER/repos?per_page=100" > test-data.json






