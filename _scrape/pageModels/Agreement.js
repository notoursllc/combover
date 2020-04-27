import { t, Selector } from 'testcafe';
import Page from './Page';
import { getFullUrl } from '../utils';

export default class Agreement extends Page {

    constructor() {
        super();
        this.url = getFullUrl('search/home');
        this.iUnderstandCheckbox = Selector('#agree_statement');
    }

    async clickAgreementCheckbox() {
        await t.click(this.iUnderstandCheckbox);
        await t.wait(2000);
        // await t.navigateTo(getFullUrl('search'));
    }

}
