## Description

An `<sp-table>` is used to create a container for displaying information. It allows users to sort, compare, and take action on large amounts of data.

### Usage

[![See it on NPM!](https://img.shields.io/npm/v/@spectrum-web-components/table?style=for-the-badge)](https://www.npmjs.com/package/@spectrum-web-components/table)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/@spectrum-web-components/table?style=for-the-badge)](https://bundlephobia.com/result?p=@spectrum-web-components/table)

```
yarn add @spectrum-web-components/table
```

Import the side effectful registration of `<sp-table>`, `<sp-table-body>`, `<sp-table-cell>`, `<sp-table-checkbox-cell>`, `<sp-table-head>`, `<sp-table-head-cell>`. and `<sp-table-row>` via:

```
import '@spectrum-web-components/table/sp-table.js';
import '@spectrum-web-components/table/sp-table-body.js';
import '@spectrum-web-components/table/sp-table-cell.js';
import '@spectrum-web-components/table/sp-table-checkbox-cell.js';
import '@spectrum-web-components/table/sp-table-head.js';
import '@spectrum-web-components/table/sp-table-head-cell.js';
import '@spectrum-web-components/table/sp-table-row.js';
```

When looking to leverage the `Table`, `TableBody`, `TableCell`, `TableCheckboxCell`, `TableHead`, `TableHeadCell`, or `TableRow` base classes as a type and/or for extension purposes, do so via:

```
import {
    Table,
    TableBody,
    TableCell,
    TableCheckboxCell,
    TableHead,
    TableHeadCell,
    TableRow
} from '@spectrum-web-components/table';
```

## Example

To ensure that the table scrolls, make sure to add a `style` attribute to `<sp-table>` with your desired height. Otherwise, the table will automatically show all its items.

```html
<sp-table size="m" style="height: 120px">
    <sp-table-head>
        <sp-table-head-cell sortable sorted="desc">
            Column Title
        </sp-table-head-cell>
        <sp-table-head-cell sortable>Column Title</sp-table-head-cell>
        <sp-table-head-cell>Column Title</sp-table-head-cell>
    </sp-table-head>
    <sp-table-body>
        <sp-table-row>
            <sp-table-cell>Row Item Alpha</sp-table-cell>
            <sp-table-cell>Row Item Alpha</sp-table-cell>
            <sp-table-cell>Row Item Alpha</sp-table-cell>
        </sp-table-row>
        <sp-table-row>
            <sp-table-cell>Row Item Bravo</sp-table-cell>
            <sp-table-cell>Row Item Bravo</sp-table-cell>
            <sp-table-cell>Row Item Bravo</sp-table-cell>
        </sp-table-row>
        <sp-table-row>
            <sp-table-cell>Row Item Charlie</sp-table-cell>
            <sp-table-cell>Row Item Charlie</sp-table-cell>
            <sp-table-cell>Row Item Charlie</sp-table-cell>
        </sp-table-row>
        <sp-table-row>
            <sp-table-cell>Row Item Delta</sp-table-cell>
            <sp-table-cell>Row Item Delta</sp-table-cell>
            <sp-table-cell>Row Item Delta</sp-table-cell>
        </sp-table-row>
        <sp-table-row>
            <sp-table-cell>Row Item Echo</sp-table-cell>
            <sp-table-cell>Row Item Echo</sp-table-cell>
            <sp-table-cell>Row Item Echo</sp-table-cell>
        </sp-table-row>
    </sp-table-body>
</sp-table>
```

## Selection

To manage selection on an `<sp-table>`, utilise the `selects` attribute on `<sp-table>`. Each `<sp-table-row>` has a `value` attribute which, by default, corresponds to its index in the table, and these `value`s tell `<sp-table>` which `<sp-table-row>`s are selected. The selected items can be manually fed in through the `.selected` attribute on the table.

### `selects="single"`

```html
    <sp-table
        size="m"
        selects="single"
        .selected=${['row1']}
        style="height: 120px"
        @change=${({ target }: Event & { target: Table }) => {
            const next = target.nextElementSibling as HTMLDivElement;
            next.textContent = `Selected: ${JSON.stringify(
                target.selected
            )}`;
        }}
    >
        <sp-table-head>
            <sp-table-head-cell sortable sorted="desc">
                Column Title
            </sp-table-head-cell>
            <sp-table-head-cell sortable>Column Title</sp-table-head-cell>
            <sp-table-head-cell>Column Title</sp-table-head-cell>
        </sp-table-head>
        <sp-table-body>
            <sp-table-row value="row1">
                <sp-table-cell>Row Item Alpha</sp-table-cell>
                <sp-table-cell>Row Item Alpha</sp-table-cell>
                <sp-table-cell>Row Item Alpha</sp-table-cell>
            </sp-table-row>
            <sp-table-row value="row2">
                <sp-table-cell>Row Item Bravo</sp-table-cell>
                <sp-table-cell>Row Item Bravo</sp-table-cell>
                <sp-table-cell>Row Item Bravo</sp-table-cell>
            </sp-table-row>
            <sp-table-row value="row3">
                <sp-table-cell>Row Item Charlie</sp-table-cell>
                <sp-table-cell>Row Item Charlie</sp-table-cell>
                <sp-table-cell>Row Item Charlie</sp-table-cell>
            </sp-table-row>
            <sp-table-row value="row4">
                <sp-table-cell>Row Item Delta</sp-table-cell>
                <sp-table-cell>Row Item Delta</sp-table-cell>
                <sp-table-cell>Row Item Delta</sp-table-cell>
            </sp-table-row>
            <sp-table-row value="row5">
                <sp-table-cell>Row Item Echo</sp-table-cell>
                <sp-table-cell>Row Item Echo</sp-table-cell>
                <sp-table-cell>Row Item Echo</sp-table-cell>
            </sp-table-row>
        </sp-table-body>
    </sp-table>
    <div>Selected: ["row1"]</div>
```

### `selects="multiple"`

When `selects` is set to "multiple", the `<sp-table-checkbox-cell>` in `<sp-table-head>` acts as the select/deselect all button.

```html
<sp-table
    size="m"
    style="height: 120px"
    .selected=${['row1', 'row2']}
    @change=${({ target }: Event & { target: Table }) => {
        const next = target.nextElementSibling as HTMLDivElement;
        next.textContent = `Selected: ${JSON.stringify(
            target.selected
        )}`;
    }}
>
    <sp-table-head>
        <sp-table-head-cell sortable sorted="desc">
            Column Title
        </sp-table-head-cell>
        <sp-table-head-cell sortable>Column Title</sp-table-head-cell>
        <sp-table-head-cell>Column Title</sp-table-head-cell>
    </sp-table-head>
    <sp-table-body>
        <sp-table-row value="row1">
            <sp-table-cell>Row Item Alpha</sp-table-cell>
            <sp-table-cell>Row Item Alpha</sp-table-cell>
            <sp-table-cell>Row Item Alpha</sp-table-cell>
        </sp-table-row>
        <sp-table-row value="row2">
            <sp-table-cell>Row Item Bravo</sp-table-cell>
            <sp-table-cell>Row Item Bravo</sp-table-cell>
            <sp-table-cell>Row Item Bravo</sp-table-cell>
        </sp-table-row>
        <sp-table-row value="row3">
            <sp-table-cell>Row Item Charlie</sp-table-cell>
            <sp-table-cell>Row Item Charlie</sp-table-cell>
            <sp-table-cell>Row Item Charlie</sp-table-cell>
        </sp-table-row>
        <sp-table-row value="row4">
            <sp-table-cell>Row Item Delta</sp-table-cell>
            <sp-table-cell>Row Item Delta</sp-table-cell>
            <sp-table-cell>Row Item Delta</sp-table-cell>
        </sp-table-row>
        <sp-table-row value="row5">
            <sp-table-cell>Row Item Echo</sp-table-cell>
            <sp-table-cell>Row Item Echo</sp-table-cell>
            <sp-table-cell>Row Item Echo</sp-table-cell>
        </sp-table-row>
    </sp-table-body>
</sp-table>
<div>Selected: ["row1", "row2"]</div>
```

## Virtualized Table

For large amounts of data, the `<sp-table>` can be virtualised to easily add table rows by using properties.

```html
    <sp-table
        size="m"
        selects="multiple"
        @change=${({ target }: Event & { target: Table }) => {
            const next = target.nextElementSibling as HTMLDivElement;
            next.textContent = `Selected: ${JSON.stringify(
                target.selected,
                null,
                ' '
            )}`;
            const nextNext = next.nextElementSibling as HTMLDivElement;
            nextNext.textContent = `Selected Count: ${target.selected.length}`;
        }}
        style="height: 200px"
        .items=${[{'key': 'value'}]}
        .renderItem=${(item: Item, index: number): TemplateResult => {
        return html`
            <sp-table-cell>Rowsaa Item Alpha ${item}</sp-table-cell>
            <sp-table-cell>Row Item Alpha ${index}</sp-table-cell>
        `;
    };}
    >
        <sp-table-head>
            <sp-table-head-cell sortable sortby="name" sorted="desc">
                Column Title
            </sp-table-head-cell>
            <sp-table-head-cell sortable sortby="date">
                Column Title
            </sp-table-head-cell>
            <sp-table-head-cell>Column Title</sp-table-head-cell>
        </sp-table-head>
    </sp-table>
```

### How to use it

The virtualised table takes `.items`, an array of type `Record`, where the key is a `string` and the value can be whatever you'd like. `.items` is then fed into the `renderItem` method, which takes an `item` and its `index` as parameters and renders the `<sp-table-row>` for each item. An example is as follows:

```javascript
const renderItem = (item: Item, index: number): TemplateResult => {
    return html`
        <sp-table-cell>Rowsaa Item Alpha ${item.name}</sp-table-cell>
        <sp-table-cell>Row Item Alpha ${item.date}</sp-table-cell>
        <sp-table-cell>Row Item Alpha ${index}</sp-table-cell>
    `;
};
```

`.renderItem` is then included as a property of `<sp-table>`, along with the `.items`, to render a full `<sp-table>` without excessive manual HTML writing.

Please note that there is a bug when attempting to select all virtualised elements. The items are selected programatically, it's just not reflected visually.

## TO-DO:

-   [ ] Scrolling w/ screenreader on virtualised table elements

-   NOT CURRENTLY NEEDED but still important

1. multiselects via attributes (not required for Express delivery)
2. Update checkbox element to dispatch event correctly
3. Non-virtual sorting (ie sort data supplied through the DOM)
4. Handle the console error that happens when we don't use Virtualizer
5. Manage sort internally & prevent sort events
6. Preventing change events
