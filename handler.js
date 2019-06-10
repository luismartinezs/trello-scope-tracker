"use strict";
const fetch = require("node-fetch");
const { trelloList, trelloCustomFields, zapier } = require(`./config.json`);
const trelloApiKey = process.env.TRELLO_API_KEY;
const trelloApiToken = process.env.TRELLO_API_TOKEN;
const Trello = require("trello");
const trello = new Trello(trelloApiKey, trelloApiToken);

const getCustomFieldsOnCard = async function(cardId) {
  try {
    const response = await trello.makeRequest(
      "get",
      `/1/cards/${cardId}/customFieldItems`,
      { webhooks: false }
    );
    return response;
  } catch (err) {
    console.error("Failed request to Trello");
  }
};

const getScope = function(customFields) {
  const scopeField = customFields.find(
    el => el.idCustomField === trelloCustomFields.scope.idCustomField
  );
  if (typeof scopeField !== "undefined") {
    return scopeField.value.number;
  }
  return 0;
};

const zapierPostRequest = async function(url, payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    console.log(`Successful request to Zapier with URL ${url}`);
    return response;
  } catch (err) {
    console.error(`Failed request to Zapier with URL ${url}`);
  }
  return null;
};

async function addRowToSheet(body) {
  const cardCustomFields = await getCustomFieldsOnCard(
    body.action.data.card.id
  );
  const scope = getScope(cardCustomFields);
  if (typeof scope !== "undefined") {
    return zapierPostRequest(zapier.addRowToSheet.url, { ...body, scope });
  }
}

const isCardMovedToList = function(listModelId, action) {
  const { listAfter, listBefore } = action.data;

  return (
    action.type === "updateCard" &&
    typeof listAfter !== "undefined" &&
    typeof listBefore !== "undefined" &&
    listAfter.id === listModelId
  );
};

async function movedToDone(body) {
  if (isCardMovedToList(trelloList.done.modelId, body.action)) {
    return await addRowToSheet(body);
  }
}

module.exports.webhook = async event => {
  try {
    if (event.body) {
      const body = JSON.parse(event.body);
      if (body.action) {
        movedToDone(body);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    return {
      statusCode: 200,
    };
  }
};
