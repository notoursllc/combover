import { t } from 'testcafe';
import fs from 'fs';
import path from 'path';

export const getBaseUrl = function() {
    return 'https://efdsearch.senate.gov';
};


export const getFullUrl = function(fragment) {
    return `${getBaseUrl()}${fragment}`;
};


export const padZero = function(val) {
    const num = parseInt(val, 10);
    if(num > -1 && num < 10) {
        return `0${num}`;
    }
    return num + '';
};


export const selectOptionByText = function($el, optionText) {
    const option = $el.find('option');
    return t.click($el).click(option.withText(optionText));
};


export const writeScrapeToFile = function(content) {
    const fileName = `scrape_${new Date().getTime()}.json`;
    const filePath = path.join(__dirname, `./output/${fileName}`);
    const jsonContent = JSON.stringify(content);

    fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
        // throws an error, you could also catch it here
        if (err) {
            console.log(err);
            throw err;
        }

        console.log("WRITE TO FILE SUCCESS", fileName, content);
    });
};
