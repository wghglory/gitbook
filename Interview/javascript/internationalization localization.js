var l10nEN = new Intl.NumberFormat('en-US');
var l10nDE = new Intl.NumberFormat('de-DE');
l10nEN.format(1234567.89) === '1,234,567.89';
l10nDE.format(1234567.89) === '1.234.567,89';

var l10nUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
var l10nGBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
var l10nEUR = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
l10nUSD.format(100200300.4) === '$100,200,300.40';
l10nGBP.format(100200300.4) === '£100,200,300.40';
l10nEUR.format(100200300.4) === '100.200.300,40 €';

var l10nEN = new Intl.DateTimeFormat('en-US');
var l10nDE = new Intl.DateTimeFormat('de-DE');
l10nEN.format(new Date('2015-01-02')) === '1/2/2015';
l10nDE.format(new Date('2015-01-02')) === '2.1.2015';
