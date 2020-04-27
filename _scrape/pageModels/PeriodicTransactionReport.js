import { Selector } from 'testcafe';
import isString from 'lodash.isstring';
import Page from './Page';
import Table from './_tools/Table';


export default class PeriodicTransactionReport extends Page {

    constructor() {
        super();
        this.reportTable = new Table(Selector('section.card table.table'));
    }


    async tableToData() {
        const config = [
            {
                key: 'transaction_owner',
                columnIndex: await this.reportTable.getHeaderIndex('Owner')
            },
            {
                key: 'transaction_ticker',
                columnIndex: await this.reportTable.getHeaderIndex('Ticker')
            },
            {
                key: 'transaction_asset_name',
                columnIndex: await this.reportTable.getHeaderIndex('Asset Name')
            },
            {
                key: 'transaction_asset_type',
                columnIndex: await this.reportTable.getHeaderIndex('Asset Type')
            },
            {
                key: 'transaction_amount',
                columnIndex: await this.reportTable.getHeaderIndex('Amount')
            },
            {
                key: 'transaction_comment',
                columnIndex: await this.reportTable.getHeaderIndex('Comment')
            },
            {
                key: 'transaction_date',
                columnIndex: await this.reportTable.getHeaderIndex('Transaction Date'),
                callback: this.reportTable.toUtcDate
            },
            {
                key: 'transaction_type',
                columnIndex: await this.reportTable.getHeaderIndex('Type'),
                callback: (val) => {
                    if(isString(val)) {
                        const lcVal = val.toLowerCase();

                        if(lcVal.includes('sale')) {
                            return lcVal.includes('full') ? 'TRANSACTION_TYPE_SALE_FULL' : 'TRANSACTION_TYPE_SALE_PARTIAL'
                        }
                        else {
                            return 'TRANSACTION_TYPE_PURCHASE';
                        }
                    }
                }
            }
        ];

        return this.reportTable.getData(config);
    }

}
