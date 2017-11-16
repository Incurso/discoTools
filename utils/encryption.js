'use strict'

const crypto = require('crypto')
require('dotenv').config()

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY // Must be 256 bytes (32 characters)
console.log(ENCRYPTION_KEY)
const IV_LENGTH = 16 // For AES, this is always 16

function encrypt (text) {
  let iv = crypto.randomBytes(IV_LENGTH)
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  return Buffer.concat([encrypted, cipher.final(), iv]).toString('base64')
}

function decrypt (text) {
  let bynaryText = Buffer.from(text, 'base64')

  let encryptedLength = bynaryText.length - IV_LENGTH
  let iv = bynaryText.slice(encryptedLength)
  let encryptedText = bynaryText.slice(0, encryptedLength)

  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

module.exports = {
  decrypt,
  encrypt
}
