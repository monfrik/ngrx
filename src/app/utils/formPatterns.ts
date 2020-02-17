export const NAME_PATTERN = /^[a-zA-Z0-9`]{1,100}$/;
export const EMAIL_PATTERN = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
export const PHONE_PATTERN = /(\([0-9]{3}\))\ ([0-9]{3})\-([0-9]{2}\-?[0-9]{2})/;
export const CITY_PATTERN = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]+$/;
export const STREET_PATTERN = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]+$/;
export const ZIPCODE_PATTERN = /^([0-9]{3})\-([0-9]{3})$/;
export const STATE_PATTERN = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]+$/;
export const STATE_SHORT_PATTERN = /^([A-Z]{2})$/;
