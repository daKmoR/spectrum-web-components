/* TABLE BODY
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
    TemplateResult,
} from '@spectrum-web-components/base';
import { property } from '@spectrum-web-components/base/src/decorators.js';
import { LitVirtualizer } from '@lit-labs/virtualizer/LitVirtualizer.js';
// import { VisibilityChangedEvent, RangeChangedEvent } from '@lit-labs/virtualizer/Virtualizer.js';
import styles from './table-body.css.js';
// import { TableRow } from './table-row.js';

/**
 * @element sp-table
 */
export class TableBody extends LitVirtualizer {
    public static override get styles(): CSSResultArray {
        return [styles];
    }

    @property({ reflect: true })
    public role = 'rowgroup';

    @property({ type: Array })
    public override items: Record<string, unknown>[] = [];

    public itemValue = (): string => {
        return '';
    };

    @property({ type: Boolean })
    public override scroller = true;

    _firstVisible = 0;

    _lastVisible = 0;

    override get renderItem(): (
        item: unknown,
        index: number
    ) => TemplateResult {
        return super.renderItem;
    }

    // do we want to include "selected/selectable" here and render it? Or do we want to
    // do that in TableRow?
    override set renderItem(
        fn: (item: unknown, index: number) => TemplateResult
    ) {
        super.renderItem = (
            item: Record<string, unknown>,
            index: number
        ): TemplateResult => {
            return html`
                <sp-table-row
                    value=${this.itemValue(/*item*/)}
                    aria-rowindex=${index + 1}
                >
                    ${fn(item, index)}
                </sp-table-row>
            `;
        };
    }
}
