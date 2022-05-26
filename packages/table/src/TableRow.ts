/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import {
    CSSResultArray,
    html,
    PropertyValues,
    SpectrumElement,
    TemplateResult,
} from '@spectrum-web-components/base';
import {
    property,
    query,
} from '@spectrum-web-components/base/src/decorators.js';
import { Checkbox } from '@spectrum-web-components/checkbox';
import styles from './table-row.css.js';
import { TableCheckboxCell } from './TableCheckboxCell.js';

/**
 * @element sp-table
 */
export class TableRow extends SpectrumElement {
    public static get styles(): CSSResultArray {
        return [styles];
    }

    @property({ reflect: true })
    public role = 'row';

    // @property({ type: Number, reflect: true })
    // public tabIndex = -1;

    @query('.checkbox')
    public checkboxCell!: TableCheckboxCell;

    @property({ type: Boolean, reflect: true })
    public selected = false;

    @property({ type: String })
    public value = '';

    protected manageSelected(): void {
        // get the value of "checked" from the sp-checkbox please kill me
        const checkbox = this.checkboxCell.querySelector(
            'sp-checkbox'
        ) as Checkbox;
        if (checkbox.checked) {
            this.selected = true;
        } else {
            this.selected = false;
        }
    }

    protected render(): TemplateResult {
        return html`
            <slot></slot>
        `;
    }

    protected firstUpdated(changes: PropertyValues): void {
        super.firstUpdated(changes);
        this.addEventListener('change', this.manageSelected);
    }

    protected updated(changes: PropertyValues): void {
        if (changes.has('selected')) {
            this.manageSelected();
        }
        super.update(changes);
    }
}
