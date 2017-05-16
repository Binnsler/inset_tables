## Fixed Columns for DataTables
`inset_tables` is a npm module that replicates much of the functionality found within the jQuery DataTables [FixedColumns Extension](https://datatables.net/extensions/fixedcolumns/) available at [datatables.net](https://datatables.net).

On initialization, `inset_tables` will create another `<table>` element ( referred to as the overlay/inset table ) that positions itself over the base table. Additionally, a `minimap` is created that allows you to scroll through hidden columns. The overlay/inset table will respond to `DataTable` events such as `search.dt`, `order.dt`, `length.dt`, `page.dt`, `click.dt`, etc. It also plays nicely with the [Select Extension](https://datatables.net/extensions/select/) from [datatables.net](https://datatables.net).

### Getting Started
1. Download `inset_tables` from npm.

```
npm install inset_tables
```

2. Pass your `jQuery` instance into the `inset_tables` constructor, which will return `jQuery` with the new `inset_tables` plugin available on the `DataTables` API.

```
import jQuery from "jquery";
import insetTables from "inset_tables";

var $ = jQuery;

$ = insetTables( $ );
```

3. Initialize your `DataTable`, making sure to pass in the option `scrollX: true`, and call the `inset_tables` function using the API of your newly-initialized `DataTable`.

```
var testTable = $( "#tester-table" ).dataTable( {
    "scrollX": true,
    "inset": 3,
    "autoWidth": true,
    "data": data,
    "columns": columns
} );

testTable.api().createInsetTable();
```

#### Please note
1. You _must_ pass in `scrollX: true` for this plugin to work.
2. You _must_ initialize your `DataTable` with `data` and `columns` options, instead of hardcoding table cells and columns. This is because in order to generate the overlay/inset table the base table data and columns must be available through `table.api().init()`, which is not possible with hardcoded data.
3. By default, `inset_tables` will fix two( 2 ) columns. You can modify this by passing an `inset` option to the `.dataTable()` constructor. The `inset` option must be greater than zero( 0 ).
4. Pass in the `autoWidth: true` option if you would like the overlay/inset table and `minimap` to be resize responsively when the browser width changes. `autoWidth: true` allows the `column-sizing.dt` to fire on resize, which this API listens for. In some cases `autoWidth: true` leads to the base table rendering strangely. If this is the case, manually hard code the table width: `<table width="100%"/>`.
