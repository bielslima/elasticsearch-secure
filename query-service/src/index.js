const ES = require("./data/elastict_search");
const express = require("express");
const Auth = require("./core/auth");
const app = express();

app.disable("x-powered-by");
app.use(express.json());

const factoryOperation = async (operationRequest) => {
  try {
    const resolveOperation = await operationRequest;

    return {
      status: 200,
      data: resolveOperation.data,
    };
  } catch (e) {
    console.log(e);

    let status, error;

    if (e.response) {
      console.error(e.response);
    }

    return {
      status: status || 500,
      data: error || {
        message: "Server failure.",
      },
    };
  }
};

app.post("/:index/search", Auth.protectMiddlewareRoute, async (req, res) => {
  const index = req.params.index;
  const query = req.body;

  const esInstance = new ES(index);

  const result = await factoryOperation(esInstance.postSearch(query));

  return res.status(result.status).json(result.data);
});

app.put("/:index/doc", Auth.protectMiddlewareRoute, async (req, res) => {
  const { index } = req.params;

  const docData = req.body;

  const esInstance = new ES(index);

  const result = await factoryOperation(esInstance.putRegister(docData));

  return res.status(result.status).json(result.data);
});

app.post("/login", (req, res) => {
  return res.json({
    token: Auth.generateToken({
      userId: "myPersonalAccountId",
    }),
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running in port ${port}`));
