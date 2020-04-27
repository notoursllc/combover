// import { t, Selector } from 'testcafe';
import isString from 'lodash.isstring';
import isFunction from 'lodash.isfunction';


export default class Table {

    constructor($el) {
        this.table = $el;
        this.tableHead = $el.find('thead');
        this.tableBody = $el.find('tbody');
    }


    async getHeaderIndex(headerText, exactText) {
        if(typeof headerText === 'number') {
            return headerText;
        }

        try {
            let headerElement;

            const config = {
                getIndex: (el) => {
                    const nodes = Array.prototype.slice.call(el.parentElement.children);
                    return nodes.indexOf(el);
                }
            };

            if(exactText) {
                headerElement = this.tableHead.find('th').withExactText(headerText).addCustomDOMProperties(config);
            }
            else {
                headerElement = this.tableHead.find('th').withText(headerText).addCustomDOMProperties(config);
            }

            return await headerElement.getIndex;
        }
        catch(err) {
            console.error(err);
        }
    }


    findRowWithText(text) {
        try {
            return this.tableBody.find('td').withExactText(text).parent('tr');
        }
        catch (err) {
            console.log(err);
        }
    }


    getRows() {
        try {
            return this.tableBody.find('tr');
        }
        catch(err) {
            console.error(err);
        }
    }


    getRow(index) {
        try {
            return this.getRows().nth(index);
        }
        catch(err) {
            console.error(err);
        }
    }


    async hasResults() {
        try {
            const firstRow = await this.getRows().nth(0);
            const exists = await firstRow.find('td.dataTables_empty').exists;
            return !exists;
        }
        catch(err) {
            console.error(err);
        }
    }


    toUtcDate(val) {
        let transformed = null;

        if(isString(val)) {
            const dateParts = val.split('/');
            if(dateParts[2]) {
                transformed = Date.UTC(
                    dateParts[2],
                    parseInt(dateParts[0], 10) - 1,
                    parseInt(dateParts[1], 10),
                    0,
                    0,
                    0
                );
            }
        }

        return transformed;
    }


    /**
     * @param {*} columnConfig
     * @example [ { key: 'firstName', columnIndex: 1, callback: function }]
     */
    async getData(columnConfig) {
        const data = [];
        const tableExists = await this.table.exists;

        if(!tableExists || !Array.isArray(columnConfig)) {
            return data;
        }

        const tableRows = await this.getRows();
        const count = await tableRows.count;

        function cleanup(str) {
            if(!isString(str)) {
                return null;
            }
            const trimmed = str.trim();
            if(trimmed === '--' || trimmed === '-' || !trimmed.length) {
                return null;
            }
            return trimmed;
        }

        for (let i=0; i<count; i++) {
            const obj = {};
            const tr = await tableRows.nth(i);

            // for each table row, loop through the columnConfig
            // assigning the key to the returned object and using the value
            // to get the TD innerText for the given nth column
            for(let i=0, l=columnConfig.length; i<l; i++) {
                const td = await tr.find('td').nth(columnConfig[i].columnIndex);
                let val = cleanup(await td.innerText);

                if(isFunction(columnConfig[i].callback)) {
                    val = await columnConfig[i].callback(val, td);
                }

                obj[columnConfig[i].key] = val;
            }

            data.push(obj);
        }

        return data;
    }

}
