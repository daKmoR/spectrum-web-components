## Description

### Usage

[![See it on NPM!](https://img.shields.io/npm/v/@spectrum-web-components/table?style=for-the-badge)](https://www.npmjs.com/package/@spectrum-web-components/table)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/@spectrum-web-components/table?style=for-the-badge)](https://bundlephobia.com/result?p=@spectrum-web-components/table)

```
yarn add @spectrum-web-components/table
```

Import the side effectful registration of `<sp-table>` via:

```
import '@spectrum-web-components/table/sp-table.js';
```

When looking to leverage the `Table` base class as a type and/or for extension purposes, do so via:

```
import { Table } from '@spectrum-web-components/table';
```

## Example

```html
<sp-table></sp-table>
```

## Questions

-   Is `selectable` necessary?
    -   TO DO:
        -   Table reacts to `selects` attr and injects sp-table-checkbox-cell into the table's head and each row, because that's how this works. yeah. ~_WILL UPDATE LIFECYCLE METHOD!!!!!_~
            -   manage single selection
        -   CHeckbox in TableHead should react to `selected` in the rows being selected. If one selects the TableHead checkbox, the TableRow checkboxes shoudl also react.
        -   Indeterminate state in tableHead checkbox cell if multiple but not all checkboxes in TableRow are selected
        -   Remove TableHead checkbox in the case of single selection
        -   If the table was to move from selects to undefined, clean up those checkboxes
-   What should `value` be in `<sp-table-row>`? The index of the row?

-   Next steparoonies:

1. make selection work with virtualised elements. rip.
2. Wire a selection monitor into the story a la Action Group
3. Scrolling w/ screenreader on virtualised table elements
4. Tests for each

-   NOT CURRENTLY NEEDED but still important

1. multiselects via attributes (not required for Express delivery)
2. Update checkbox element to dispatch event correctly
3. Non-virtual sorting (ie sort data supplied through the DOM)
4. console error when we don't use Virtualizer
5. Westbrook wants to do something and he cannot remember what it is
