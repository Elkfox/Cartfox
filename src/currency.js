const Currency = {

  formatWithDelimiters: (amount, precision = 2, thousands = ',', decimal = '.') => {
    if (isNaN(amount) || amount == null) {
      return 0;
    }

    const number = (amount / 100.0).toFixed(precision);

    const parts = number.split('.');
    const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
    const cents = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  },
  formatMoney: (amount, format) => {
    const moneyFormat = '${{amount}}'
    if (typeof amount === 'string') {
      const cents = amount.replace('.', '');
    }
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = (format || moneyFormat);

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = this.formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = this.formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = this.formatWithDelimiters(cents, 1, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = this.formatWithDelimiters(cents, 0, '.', ',');
        break;
      default:
        value = this.formatWithDelimiters(cents, 2);
        break;
    }
    return formatString.replace(placeholderRegex, value);
  },
};

module.exports = Currency;
