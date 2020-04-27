import { Selector } from 'testcafe';
import Page from './Page';
import Table from './_tools/Table';
import { getFullUrl, selectOptionByText } from '../utils';


export default class ReportSearchResults extends Page {

    constructor() {
        super();

        // NOTE: the URL does not change from the search filter page,
        // so this probably isn't that useful
        this.url = getFullUrl('/search');

        this.pagination = {
            numSearchResultsSelect: Selector('[name="filedReports_length"]'),
            previousLink: Selector('#filedReports_previous'),
            nextLink: Selector('#filedReports_next')
        };

        this.reportTable = new Table(Selector('#filedReports'));
    }


    async tableToData() {
        const config = [
            {
                key: 'report_first_name',
                columnIndex: await this.reportTable.getHeaderIndex('First Name')
            },
            {
                key: 'report_last_name',
                columnIndex: await this.reportTable.getHeaderIndex('Last Name')
            },
            {
                key: 'report_office',
                columnIndex: await this.reportTable.getHeaderIndex('Office')
            },
            {
                key: 'report_transaction_url',
                columnIndex: await this.reportTable.getHeaderIndex('Report Type'),
                callback: async (val, td) => {
                    const href = await td.find('a').getAttribute('href');
                    return getFullUrl(href);
                }
            },
            {
                key: 'report_date_filed',
                columnIndex: await this.reportTable.getHeaderIndex('Date Received'),
                callback: this.reportTable.toUtcDate
            }
        ];

        return this.reportTable.getData(config);
    }


    setNumberOfResultsPerPage(val) {
        return selectOptionByText(
            this.pagination.numSearchResultsSelect,
            val + ''
        );
    }


    async hasNextPage() {
        const hasDisabledClass = await this.pagination.nextLink.hasClass('disabled');
        return !hasDisabledClass;
    }

}
