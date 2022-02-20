const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");

module.exports = class ES {
  index = "default";
  elasticUrl = "";

  constructor(index) {
    if (index) this.index = index;

    this.elasticUrl = `http://${process.env.ELASTIC_HOST}:${process.env.ELASTIC_PORT}/${this.index}`;
  }

  logger(method, message) {
    console.log(`[ES ${method}] - ${message}`);
  }

  postSearch(query) {
    const elasticUrl = `${this.elasticUrl}/_search`;

    this.logger("Post search", elasticUrl);

    return axios.post(elasticUrl, query);
  }

  putRegister(dataDoc) {
    let finalIdDoc;

    if (dataDoc.id) {
      finalIdDoc = dataDoc.id;
      delete dataDoc.id;
    } else {
      finalIdDoc = uuidv4();
    }

    const elasticUrl = `${this.elasticUrl}/_doc/${finalIdDoc}`;

    this.logger("Put register", elasticUrl);

    return axios.put(elasticUrl, dataDoc);
  }
};
