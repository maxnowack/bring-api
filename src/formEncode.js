export default data => Object
  .keys(data)
  .reduce((memo, key) => {
    let val = memo;
    if (val) val += '&';
    val += `${encodeURIComponent(key)}=${encodeURIComponent(data[key] == null ? '' : data[key])}`;
    return val;
  }, '');
