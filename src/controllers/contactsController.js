const serviceContact = require("../services/contactsService");

const listContactsController = async (req, res, next) => {
  const contacts = await serviceContact.listContacts(req);
  res.status(200).json({ contacts, status: "success" });
};

const getContactByIdController = async (req, res, next) => {
  const contactId = await serviceContact.getContactById(req);

  res.status(200).json({ contactId, status: "success" });
};

const addContactController = async (req, res, next) => {
  const newContacts = await serviceContact.addContact(req);
  res.status(201).json({ newContacts });
};

const removeContactController = async (req, res, next) => {
  const removeContact = await serviceContact.removeContact(req);

  res
    .status(200)
    .json({ removeContact, status: "Delete contact successfully" });
};

const updateContactController = async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const user = req.user;
  const contact = await serviceContact.updateContact(id, body, user);
  res.status(200).json({ contact, status: "Update contact successfully" });
};

const favoriteContactController = async (req, res, next) => {
  const contact = await serviceContact.favoriteContact(req);
  res
    .status(200)
    .json({ contact, status: "Contacts Favorite status change successfully" });
};

module.exports = {
  listContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  favoriteContactController,
};
