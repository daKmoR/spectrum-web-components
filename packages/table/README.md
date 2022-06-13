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

-   TO-DO:

-   [x] manually applied checkbox cell
-   [x] initial value of selected not propagates
-   values are "synthetic" (literal value attribute)
-   [x] select all only selects available items
-   [x] selected value needs to be validated
-   [x] check that tests still pass
-   [x] write tests for virtualised table
-   [x] review tab order entries for checkboxes
-   [x] scroll with screen reader on virtualised table elements
-   [x] test for click selection on table checkboxes
-   [x] Allow selects to be changed by the application on head checkbox
-   [x] Fix bug: Virtualised table does not row select on first update
-   [ ] Write tests for RangeChanged and VisbilityChanged events on sp table via spy()ing
-   [x] Move makeItemsTwo into index storybook file
-   [x] Value for `selected` is managed in two different places. Stop doing that.
-   [x] ## Write a test to make sure select all triggers appropriately. ie items = 0 and selected length = 0 should not be true selectAll...
-   [ ] Scrolling w/ screenreader on virtualised table elements

-   NOT CURRENTLY NEEDED but still important

1. multiselects via attributes (not required for Express delivery)
2. Update checkbox element to dispatch event correctly
3. Non-virtual sorting (ie sort data supplied through the DOM)
4. Handle the console error that happens when we don't use Virtualizer
5. Manage sort internally & prevent sort events
6. Preventing change events
