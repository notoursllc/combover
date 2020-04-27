import { t, Selector } from 'testcafe';
import Page from './Page';
import { getFullUrl, padZero, selectOptionByText } from '../utils';

export default class ReportSearch extends Page {

    constructor() {
        super();
        this.url = getFullUrl('/search');

        this.filters = {
            firstName: Selector('#firstName'),
            lastName: Selector('#lastName'),
            filterTypes: {
                senator: Selector('.senator_filer'),
                senatorForStateSelect: Selector('#senatorFilerState'),
                candidate: Selector('.candidate_filer'),
                candidateForStateSelect: Selector('#candidateFilerState'),
                formerSenator: Selector('#filerTypes[value="5"]') // this seems pretty fragile
            },
            reportTypes: {
                annual: Selector('[name="report_type"][value="7"]'),
                dueDateExtension: Selector('[name="report_type"][value="10"]'),
                periodicTransaction: Selector('[name="report_type"][value="11"]'),
                blindTrust: Selector('[name="report_type"][value="14"]'),
                other: Selector('[name="report_type"][value="15"]')
            },
            dateFiled: {
                from: Selector('[name="submitted_start_date"'),
                to: Selector('[name="submitted_end_date"')
            }
        };

        this.submitButton = Selector('#searchForm button[type="submit"]');
    }


    setDatePicker($el, month, day, year) {
        return t.typeText($el, `${padZero(month)}/${padZero(day)}/${year}`, {replace: true});
    }


    setDateFiledFrom(month, day, year) {
        return this.setDatePicker(
            this.filters.dateFiled.from,
            month,
            day,
            year
        );
    }


    setDateFiledTo(month, day, year) {
        return this.setDatePicker(
            this.filters.dateFiled.to,
            month,
            day,
            year
        );
    }


    setSenatorState(state) {
        return selectOptionByText(
            this.filters.filterTypes.senatorForStateSelect,
            state
        );
    }


    setCandidateState(state) {
        return selectOptionByText(
            this.filters.filterTypes.candidateForStateSelect,
            state
        );
    }

}
