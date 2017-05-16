// Lodash Methods
import {
    debounce,
    map
} from "lodash/fp";

function insetTables( $jQuery ){
    $jQuery.fn.dataTable.Api.register( "styleTables()", function styleTables(){
        var scrollTable = this.getScrollTable();
        var scrollBody = this.getScrollBody();
        var scrollPosition = $jQuery( scrollTable ).position();
        var overlayTable = this.getOverlayTable();

        $jQuery( overlayTable ).css( {
            "margin": "0",
            "background-color": "#FFFFFF"
        } );

        $jQuery( "#overlay-table_wrapper" ).css( {
            "position": "absolute",
            "top": scrollPosition.top
        } );

        $jQuery( scrollBody ).css( { "overflow": "hidden" } );

        $jQuery( scrollTable ).parent().css( { "position": "relative" } );
    } );

    // Resets empty table message so it appears horizontally centered within both tables
    $jQuery.fn.dataTable.Api.register( "updateEmptyMessage()", function updateEmptyMessage(){
        var scrollBody = this.getScrollBody();
        var scrollTable = this.getScrollTable();
        var overlayTable = this.getOverlayTable();
        var scrollWidth = $jQuery( scrollTable ).outerWidth();
        var overlayWidth = $jQuery( overlayTable ).outerWidth();

        var emptyTable = $jQuery( scrollBody ).find( ".dataTables_empty" );
        var visiScrollWidth;
        var leftPadding;
        var emptyTextWidth;

        $jQuery( emptyTable ).html( "<span>" + $jQuery( emptyTable ).text() + "</span>" );

        emptyTextWidth = $jQuery( emptyTable ).find( "span" ).outerWidth();
        visiScrollWidth = scrollWidth - overlayWidth;
        leftPadding = ( visiScrollWidth / 2 ) + overlayWidth - ( emptyTextWidth / 2 );

        emptyTable.css( {
            "text-align": "left",
            "padding-left": `${leftPadding}px`
        } );
    } );

    $jQuery.fn.dataTable.Api.register( "tableResize()", function tableResize(){
        this.resetMiniMap();
        this.updateUI();
    } );

    $jQuery.fn.dataTable.Api.register( "updateUI()", function updateUI(){
        var overlayTable = this.getOverlayTable();
        var scrollBody = this.getScrollBody();
        var emptyTable = $jQuery( scrollBody ).find( ".dataTables_empty" );
        var $table = $jQuery( "#DataTables_Table_8" );

        $jQuery( $table ).trigger( "update:ui" );

        this.updateHeaderHeight();
        this.updateHeaderWidth();
        this.correctRowHeight();
        this.updateEmptyMessage();
        this.resetMiniMap();

        if( emptyTable.length == 0 ){
            this.updateOverlayWidth();
        }
        else{
            // If empty, resets overlayTable to proper DT-calculated width
            overlayTable.css( {
                "width": "1px"
            } );
        }
    } );

    // Within your JS, call this function to update Overlay table with new data
    $jQuery.fn.dataTable.Api.register( "triggerUpdateEvent()", function triggerUpdateEvent( newData ){
        var table = $jQuery( this.table().body() ).closest( ".dataTable" );

        $jQuery( table ).trigger( "update:data:complete", { "tableData": newData } );
    } );

    $jQuery.fn.dataTable.Api.register( "updateOverlayWidth()", function updateOverlayWidth( cells ){
        var initData = this.getScrollData();
        var overlayTable = this.getOverlayTable();
        var scrollBody = this.getScrollTable();
        var tableCells = cells || $jQuery( scrollBody ).find( "tbody tr:first-child td" );

        var selectedCells = tableCells.slice( 0, initData.inset );
        var cellsWidth = this.getCellsWidth( selectedCells );
        var overlayWidth = cellsWidth.reduce( ( a, b ) => a + b, 0 );

        overlayTable.css( {
            "width": `${overlayWidth}px`
        } );
    } );

    $jQuery.fn.dataTable.Api.register( "setOverlayWidth()", function setOverlayWidth(){
        var scrollTable = this.getScrollTable();
        var headRows = $jQuery( scrollTable ).find( ".dataTables_scrollHead thead tr" );
        var tableHeaders = this.getTableHeaders();

        if( headRows.length > 1 ){
            this.updateOverlayWidth();
        }
        else{
            this.updateOverlayWidth( tableHeaders );
        }
    } );

    $jQuery.fn.dataTable.Api.register( "updateHeaderHeight()", function updateHeaderHeight(){
        var overlayTable = this.getOverlayTable();
        var table = this.getScrollTable();
        var tableHeadRows = $jQuery( table ).find( ".dataTables_scrollHead thead tr" );
        var overlayHeadRows = $jQuery( overlayTable ).find( "thead tr" );

        overlayHeadRows.each(
            ( i, tr ) => {
                var rowHeight = $jQuery( tableHeadRows[i] ).outerHeight();

                $jQuery( tr ).css( {
                    "height": `${rowHeight}px`
                } );
            }
        );
    } );

    $jQuery.fn.dataTable.Api.register( "updateHeaderWidth()", function updateHeaderWidth(){
        var scrollTable = this.getScrollTable();

        $jQuery( scrollTable ).find( ".dataTables_scrollHeadInner" ).css( {
            "box-sizing": "inherit"
        } );
    } );

    $jQuery.fn.dataTable.Api.register( "correctRowHeight()", function correctRowHeight(){
        var overlayTable = this.getOverlayTable();
        var overlayRows = $jQuery( overlayTable ).find( "tbody tr" );

        var scrollTable = this.getScrollTable();
        var scrollRows = $jQuery( scrollTable ).find( "tbody tr" );

        overlayRows.each(
            ( i, row ) => $jQuery( row ).css( {
                "height": $jQuery( scrollRows[i] ).height()
            } )
        );
    } );

    $jQuery.fn.dataTable.Api.register( "getCellsWidth()", function getCellsWidth( cells ){
        return map(
            ( cell ) => $jQuery( cell ).outerWidth()
        )( cells );
    } );

    $jQuery.fn.dataTable.Api.register( "getTableHeaders()", function getTableHeaders(){
        var table = this.getScrollTable();

        return table.find( ".dataTables_scrollHeadInner thead tr th" );
    } );

    $jQuery.fn.dataTable.Api.register( "setScrollData()", function setScrollData( data ){
        var scrollBody = this.getScrollBody();

        $jQuery( scrollBody ).data( data );
    } );

    $jQuery.fn.dataTable.Api.register( "getScrollData()", function getScrollData(){
        var scrollBody = this.getScrollBody();

        return $jQuery( scrollBody ).data();
    } );

    $jQuery.fn.dataTable.Api.register( "getScrollTable()", function getScrollTable(){
        var body = this.table().body();

        return $jQuery( body ).closest( ".dataTables_scroll" );
    } );

    $jQuery.fn.dataTable.Api.register( "getScrollBody()", function getScrollBody(){
        var body = this.table().body();

        return $jQuery( body ).closest( ".dataTables_scrollBody" );
    } );

    $jQuery.fn.dataTable.Api.register( "getOverlayTable()", function getOverlayTable(){
        return $jQuery( "#overlay-table" );
    } );

    $jQuery.fn.dataTable.Api.register( "resetMiniMap()", function resetMiniMap(){
        this.destroyMiniMap();
        this.generateMiniMap();
    } );

    $jQuery.fn.dataTable.Api.register( "destroyMiniMap()", function destroyMiniMap(){
        var table = this.getScrollTable();
        var initData = this.getScrollData();
        var scrollBody = this.getScrollBody();
        var crumbs = table.parent().find( ".minimap" );

        var right = table.parent().find( ".minimap .right" );
        var left = table.parent().find( ".minimap .left" );

        $jQuery( right ).off();
        $jQuery( left ).off();

        $jQuery( crumbs ).remove();

        this.setScrollData( {
            "left": 0,
            "index": initData.inset
        } );

        scrollBody.animate( { "scrollLeft": 0 } );
    } );

    $jQuery.fn.dataTable.Api.register( "updateMiniMap()", function updateMiniMap( index, left ){
        var initData = this.getScrollData();
        var data = this.getScrollData();
        var scrollBody = this.getScrollBody();
        var scrollTable = this.getScrollTable();
        var container = $jQuery( scrollTable ).parent();
        var crumbElements = $jQuery( ".minimap ul" ).find( "li" );
        var currentIndex = index - initData.inset;
        var lastCrumb = currentIndex + data.lastActiveCrumb;

        scrollBody.animate( { "scrollLeft": left }, 150 );

        this.setScrollData( {
            "left": left,
            "index": index
        } );

        crumbElements.each(
            ( i, crumb ) => $jQuery( crumb ).removeClass( "active" ).css( {
                "background-color": "#E8E8E8"
            } )
        );

        crumbElements.each(
            ( i, crumb ) => {
                if( i >= currentIndex && i < lastCrumb ){
                    $jQuery( crumb ).addClass( "active" ).css( {
                        "background-color": "#969696"
                    } );
                }
            }
        );
    } );

    $jQuery.fn.dataTable.Api.register( "setMiniMapListeners()", function setMiniMapListeners(){
        var table = this.getScrollTable();
        var scrollBody = this.getScrollBody();
        var rightArrow = table.parent().find( ".minimap .right" );
        var leftArrow = table.parent().find( ".minimap .left" );
        var crumbs = table.parent().find( ".minimap ul li" );
        var data = this.getScrollData();
        var left;
        var index;

        leftArrow.on(
            "click",
            () => {
                var tableCells = $jQuery( scrollBody ).find( "tbody tr:first-child td" );
                var width = $jQuery( tableCells[ data.index - 1 ] ).outerWidth();

                if( data.left > 0 ){
                    left = data.left - width;
                    index = data.index - 1;

                    this.updateMiniMap( index, left );
                }
            }
        );

        rightArrow.on(
            "click",
            () => {
                var tableCells = $jQuery( scrollBody ).find( "tbody tr:first-child td" );
                var tableWidth = $jQuery( table ).find( ".dataTable" ).width();
                var scrollWidth = $jQuery( scrollBody ).width();
                var width = $jQuery( tableCells[ data.index ] ).outerWidth();

                if( data.left + scrollWidth < tableWidth ){
                    left = data.left + width;
                    index = data.index + 1;

                    this.updateMiniMap( index, left );
                }
            }
        );

        crumbs.on(
            "click",
            ( event ) => {
                var tableCells = $jQuery( scrollBody ).find( "tbody tr:first-child td" );
                var crumbIndex = $jQuery( crumbs ).index( event.target );
                var selectedCells;
                var cellsWidth;

                if( crumbs.length - data.lastActiveCrumb <= crumbIndex ){
                    crumbIndex = crumbs.length - data.lastActiveCrumb;
                }

                index = crumbIndex + data.inset;

                selectedCells = tableCells.slice( data.inset, index );
                cellsWidth = this.getCellsWidth( selectedCells );

                left = cellsWidth.reduce( ( a, b ) => a + b, 0 );

                this.updateMiniMap( index, left );
            }
        );

        return this;
    } );

    $jQuery.fn.dataTable.Api.register( "setMiniMapCss()", function setMiniMapCss(){
        var table = this.getScrollTable();
        var container = $jQuery( table ).parent();

        $jQuery( container ).find( ".minimap" ).css( {
            "display": "flex",
            "flex-direction": "row",
            "align-items": "center",
            "justify-content": "flex-end"
        } );

        $jQuery( container ).find( ".minimap span" ).css( {
            "margin": "0 10px",
            "font-size": "2.6rem",
            "cursor": "pointer",
            "transform": "translate( 0, -15% )"
        } );

        $jQuery( container ).find( ".minimap ul" ).css( {
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "center",
            "padding": "0",
            "margin": "0"
        } );

        $jQuery( container ).find( ".minimap ul li" ).css( {
            "width": "7px",
            "height": "7px",
            "margin-right": "10px",
            "background-color": "#E8E8E8",
            "list-style": "none",
            "cursor": "pointer",
            "border-radius": "10px"
        } );

        $jQuery( container ).find( ".minimap ul .active" ).css( {
            "background-color": "#969696"
        } );

        $jQuery( container ).find( ".minimap ul li:last-child" ).css( {
            "margin-right": "0"
        } );
    } );

    $jQuery.fn.dataTable.Api.register( "generateMiniMap()", function generateMiniMap(){
        var initData = this.getScrollData();
        var scrollBody = this.getScrollBody();

        var table = this.getScrollTable();
        var tableWidth = $jQuery( table ).outerWidth();

        var tableCells = $jQuery( scrollBody ).find( "tbody tr:first-child td" );
        var cellsWidth = this.getCellsWidth( tableCells );

        var miniMapTemplate = "<div class=\"minimap\"><span class=\"left\">&#xab;</span><ul></ul><span class=\"right\">&#xbb;</span></div>";

        var crumbs = tableCells.slice( initData.inset, tableCells.length );
        var sum = 0;
        var crumbElements;
        var lastActiveCrumb;

        // Generate Mini Map
        table.parent().prepend( miniMapTemplate );
        crumbs.each(
            () => table.parent().find( ".minimap ul" ).append( "<li></li>" )
        );

        // Calculate Index of Last Visible Column
        cellsWidth.some(
        ( a, i ) => {
            lastActiveCrumb = i;
            if( sum + a > tableWidth ){
                return true;
            }
            sum += a;
        } );

        lastActiveCrumb -= initData.inset;

        this.setScrollData( {
            "lastActiveCrumb": lastActiveCrumb
        } );

        // Set Active Classes
        crumbElements = $jQuery( ".minimap ul" ).find( "li" );

        crumbElements.each(
            ( i, crumb ) => {
                if( i < lastActiveCrumb ){
                    $jQuery( crumb ).addClass( "active" );
                }
            }
        );

        this.setMiniMapCss();

        this.setMiniMapListeners();
    } );

    $jQuery.fn.dataTable.Api.register( "toggleAllSelects()", function toggleAllSelects(){
        var scrollHeadSelect = $jQuery( ".dataTables_scrollHead" ).find( "th.select" );
        var overlayHeadSelect = $jQuery( "#overlay-table" ).find( "thead th.select" );
        var rows = this.table().rows();

        if( scrollHeadSelect[0].classList.value.includes( "selected" ) ){
            rows.deselect();
        }
        else{
            rows.select();
        }

        scrollHeadSelect.toggleClass( "selected" );
        overlayHeadSelect.toggleClass( "selected" );

        return this;
    } );

    $jQuery.fn.dataTable.Api.register( "hideOverlayColumns()", function hideOverlayColumns( overlayTable ){
        var initData = this.getScrollData();
        var overlayApi = overlayTable.api();
        var tableHeaders = this.getTableHeaders();
        var selectedHeaders = tableHeaders.slice( 0, initData.inset );

        var visibleColumns = map(
            ( headCell ) => headCell.cellIndex
        )( selectedHeaders );

        overlayApi.table().columns().visible( false );
        overlayApi.table().columns( visibleColumns ).visible( true );
    } );

    $jQuery.fn.dataTable.Api.register( "removeOverlayUI()", function removeOverlayUI(){
        var overlayTable = this.getOverlayTable();
        var overlayLength = overlayTable.parent().find( ".dataTables_length" );
        var overlayPaginate = overlayTable.parent().find( ".dataTables_paginate" );
        var overlaySearch = overlayTable.parent().find( "#overlay-table_filter" );

        overlayLength.remove();
        overlayPaginate.remove();
        overlaySearch.remove();
    } );

    $jQuery.fn.dataTable.Api.register( "setOverlayListeners()", function setOverlayListeners( overlayTable ){
        var overlayApi = overlayTable.api();
        var overlaySelectAll = $jQuery( overlayTable ).find( "thead th.select" );
        var scrollTable = $jQuery( this.table().body() ).closest( ".dataTable" );
        var scrollData = this.getScrollData();

        overlayTable.on(
            "update:sorting",
            ( event, settings ) => {
                this.setScrollData( {
                    "overlaySort": true
                } );

                // Set Overlay Table to same page and order as Scroll Table
                overlayApi.table()
                    .page( this.page() )
                    .order( settings.aaSorting[0] )
                    .draw( false );

                this.setScrollData( {
                    "overlaySort": false
                } );
            }
        );

        scrollTable.on(
            "order.dt",
            ( event, settings ) => {
                if( settings.aaSorting.length ){
                    overlayTable.trigger( "update:sorting", settings );
                }
            }
        );

        overlayTable.on(
            "order.dt",
            ( event, settings ) => {
                // Order Scroll Table only if it has sort data, was not triggered by Overlay sort, and is not triggered by search
                if( settings.aaSorting.length &&
                    !scrollData.overlaySort &&
                    !scrollData.scrollSearch ){
                    this.table().order( settings.aaSorting[0] ).draw();
                }
            }
        );

        overlayTable.on(
            "click.dt",
            "td",
            ( event ) => {
                var overlayRow = event.target.closest( "tr" );
                var selectedRow = overlayApi.table().rows( overlayRow );

                if( overlayRow.classList.value.includes( "selected" ) ){
                    this.table().rows( selectedRow ).deselect();
                }
                else{
                    this.table().rows( selectedRow ).select();
                }
            }
        );

        scrollTable.on(
            "select.dt deselect.dt",
            () => {
                var selected = this.table().rows( { "selected": true } ).indexes();

                overlayApi.table()
                .rows()
                .deselect();

                overlayApi.table()
                .rows( selected )
                .select();
            }
        );

        overlaySelectAll.on(
            "click.dt",
            () => this.toggleAllSelects()
        );

        scrollTable.on(
            "column-sizing.dt",
            debounce( 250, this.tableResize, { "trailing": true } )
        );


        scrollTable.on(
            "page.dt",
            () => overlayApi.page( this.page() ).draw( "page" )
        );

        scrollTable.on(
            "search.dt",
            ( event, settings ) => {
                var searchValue = settings.oPreviousSearch.sSearch;

                if( searchValue != scrollData.prevSearch ){
                    this.setScrollData( {
                        "scrollSearch": true
                    } );

                    overlayApi.search( searchValue ).draw();
                }

                this.setScrollData( {
                    "prevSearch": searchValue,
                    "scrollSearch": false
                } );
            }
        );

        scrollTable.on(
            "length.dt",
            ( event, settings, length ) => overlayApi.page.len( length ).draw( false )
        );

        // Update Overlay table with new data from call to this.triggerUpdateEvent()
        scrollTable.on(
            "update:data:complete",
            ( event, data ) => {
                overlayApi.clear();
                overlayApi.rows.add( data.tableData );
                overlayApi.draw();

                setTimeout(
                    () => {
                        // This allows the table to reset column width, if necessary
                        this.updateUI();
                        this.table().page( 1 ).draw();
                        this.updateOverlayWidth();
                    },
                    250
                );
            }
        );

        scrollTable.on(
            "draw.dt",
            () => this.updateUI()
        );
    } );

    $jQuery.fn.dataTable.Api.register( "generateOverlayTable()", function generateOverlayTable(){
        var overlayTable;
        var initData = this.init();
        var table = this.getScrollTable();

        var headerHTML = $jQuery( table ).find( ".dataTables_scrollHead thead" ).html();

        table.after( "<table id=\"overlay-table\"/>" );

        overlayTable = $jQuery( table ).parent().find( "#overlay-table" );
        $jQuery( overlayTable ).html( `<thead>${headerHTML}</thead>` );

        this.updateHeaderHeight();
        this.updateHeaderWidth();

        overlayTable.dataTable( {
            "searching": true,
            "autoWidth": true,
            "language": {
                "emptyTable": "---",
                "zeroRecords": "---"
            },
            "pageLength": initData.pageLength,
            "paging": true,
            "info": false,
            "ordering": true,
            "columns": initData.columns,
            "data": initData.data,
            "initComplete": () => this.updateUI()
        } );

        this.removeOverlayUI();

        this.hideOverlayColumns( overlayTable );

        this.setOverlayWidth();

        this.updateEmptyMessage();

        this.setOverlayListeners( overlayTable );

        return this;
    } );

    $jQuery.fn.dataTable.Api.register( "generateInsetElements()", function generateInsetElements(){
        this.generateOverlayTable();

        this.resetMiniMap();

        this.styleTables();

        return this;
    } );

    $jQuery.fn.dataTable.Api.register( "createInsetTable()", function createInsetTable(){
        this.setScrollData( {
            "left": 0,
            "index": this.init().inset || 2,
            "inset": this.init().inset || 2,
            "overlaySort": false,
            "prevSearch": ""
        } );

        this.generateInsetElements();

        return this;
    } );

    return $jQuery;
}

module.exports = insetTables;
