const { create } = require("connect-mongo");
const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  tel: { type: String, required: false, default: "" },
  ceatedAt: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("Contact", ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.register = async function () {
  this.valid();

  if (this.errors.length > 0) return;

  this.contact = await ContactModel.create(this.body);
};

Contact.prototype.valid = async function () {
  this.cleanUp();

  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("E-mail inválido.");
  if (!this.body.name) this.errors.push("Nome é um campo obrigatório");
  if (!this.body.email && !this.body.tel)
    this.errors.push(
      "Pelo menos um contato precisa ser enviado: email ou telefone"
    );
};

Contact.prototype.cleanUp = async function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  this.body = {
    name: this.body.name,
    surname: this.body.surname,
    email: this.body.email,
    tel: this.body.tel,
  };
};

Contact.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valid();

  if (this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Static
Contact.searchId = async function (id) {
  if (typeof id !== "string") return;

  const contact = await ContactModel.findById(id);
  return contact;
};

Contact.searchContact = async function () {
  const contacts = await ContactModel.find().sort({ ceatedAt: -1 });
  return contacts;
};

Contact.delete = async function (id) {
  if (typeof id !== "string") return;

  const contact = await ContactModel.findOneAndDelete({ _id: id });
  return contact;
};

module.exports = Contact;
