import ReportSearchPO from '../pageModels/ReportSearch';
import ReportSearchResultsPO from '../pageModels/ReportSearchResults';
import PeriodicTransactionReportPO from '../pageModels/PeriodicTransactionReport';
import AgreementPO from '../pageModels/Agreement';
import { writeScrapeToFile } from '../utils';

const ReportSearch = new ReportSearchPO();
const ReportSearchResults = new ReportSearchResultsPO();
const PeriodicTransactionReport = new PeriodicTransactionReportPO();
const Agreement = new AgreementPO();

fixture('/search')

test('testing all search filters', async t => {
    if(Agreement.iUnderstandCheckbox.exists) {
        await Agreement.clickAgreementCheckbox();
    }

    await t.typeText(ReportSearch.filters.firstName, 'Greg', {replace: true});
    await t.typeText(ReportSearch.filters.lastName, 'Bruins', {replace: true});

    // filter type
    await t.click(ReportSearch.filters.filterTypes.senator);
    await ReportSearch.setSenatorState('California');
    await t.click(ReportSearch.filters.filterTypes.candidate);
    await ReportSearch.setCandidateState('Alabama');
    await t.click(ReportSearch.filters.filterTypes.formerSenator);

    // report types
    await t.click(ReportSearch.filters.reportTypes.annual);
    await t.click(ReportSearch.filters.reportTypes.dueDateExtension);
    await t.click(ReportSearch.filters.reportTypes.periodicTransaction);
    await t.click(ReportSearch.filters.reportTypes.blindTrust);
    await t.click(ReportSearch.filters.reportTypes.other);

    // date filed
    await ReportSearch.setDateFiledFrom(4, 1, 2020);
    await ReportSearch.setDateFiledTo(4, 30, 2020);

    await t.click(ReportSearch.submitButton);
    // await t.wait(10000);
})
.skip
.before(async t => {
    await t.navigateTo(ReportSearch.url);
});


test('testing2', async t => {
    if(Agreement.iUnderstandCheckbox.exists) {
        await Agreement.clickAgreementCheckbox();
    }

    await t.click(ReportSearch.filters.reportTypes.periodicTransaction);

    // date filed
    await ReportSearch.setDateFiledFrom(4, 3, 2020);
    await ReportSearch.setDateFiledTo(4, 4, 2020);
    await t.click(ReportSearch.submitButton);
    // await ReportSearchResults.setNumberOfResultsPerPage(100);
    await t.wait(3000);

    const searchData = await ReportSearchResults.tableToData();
    console.log("searchData", searchData)

    let pageData = [];

    if(Array.isArray(searchData)) {
        for(let i=0, l=searchData.length; i<l; i++) {
            const row = searchData[i];

            if(row.report_transaction_url) {
                await t.navigateTo(row.report_transaction_url);
                await t.wait(3000);

                const reportData = await PeriodicTransactionReport.tableToData();

                // Decorate each reportData result with senator data too (row).
                if(Array.isArray(reportData)) {
                    reportData.forEach((obj) => {
                        for(const key in row) {
                            obj[key] = row[key];
                        }

                        // manually adding the report type
                        obj.report_type = 'REPORT_TYPE_PERIODIC_TRANSACTION';
                    });
                }

                pageData = pageData.concat(reportData);
            }
        }
    }

    console.log("PAGE DATA DONE", pageData.length, pageData);
    writeScrapeToFile(pageData);

    // TODO: persist data to DB

})
.before(async t => {
    await t.navigateTo(ReportSearch.url);
});

