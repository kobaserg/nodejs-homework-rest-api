const { Contacts } = require("../db/contactsModel");
const { ParametersError } = require("../helpers/errors");

const verifyErrorById = (id, found) => {
  if (!found) {
    throw new ParametersError(`Contact with id '${id}' not found!`);
  }
};

const listContacts = async (req) => {
  const { _id: owner } = req.user;
  let { page, limit, favorite } = req.query;

  if (!favorite) {
    favorite = { $in: [true, false] };
  }

  const skip = (page - 1) * limit;
  const contacts = await Contacts.find(
    { owner, favorite },
    "-createdAt -updatedAt ",
    {
      skip,
      limit,
    }
  ).populate("owner", " email");
  return { contacts, page, limit };
};

const getContactById = async (req) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const contact = await Contacts.findOne({ _id: id, owner });
  verifyErrorById(id, contact);

  return contact;
};

const removeContact = async (req) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const contact = await Contacts.findOneAndRemove({ _id: id, owner });
  verifyErrorById(id, contact);
  return contact;
};

const addContact = async (req) => {
  const { _id: owner } = req.user;
  const newContact = new Contacts({ ...req.body, owner });

  await newContact.save();
  return newContact;
};

const updateContact = async (req) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const { name, email, phone } = req.body;
  const searchContact = await Contacts.findOneAndUpdate(
    { _id: id, owner },
    { name, email, phone },
    { new: true }
  );
  verifyErrorById(id, searchContact);

  return searchContact;
};

const favoriteContact = async (req) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const { favorite } = req.body;
  const searchContact = await Contacts.findOneAndUpdate(
    { _id: id, owner },
    { $set: { favorite } }
  );

  verifyErrorById(id, searchContact);

  return searchContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  favoriteContact,
};
