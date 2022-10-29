const express = require("express");
const axios = require("axios");

const request = (url, method, data = {}, headers = {}) => {
  var options = {
    method: method,
    url: url,
    headers: { "content-type": "application/json", ...headers },
    data: data,
  };

  return axios.request(options)
};
module.exports = request;
