function formatNumber(number) {
    let integer = Math.floor(number).toString();
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return integer;
}

export default formatNumber;
