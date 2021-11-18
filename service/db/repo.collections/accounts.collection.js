module.exports = function(dbModel) {
	let collectionName = path.basename(__filename, '.collection.js')
	let schema = mongoose.Schema({
		mainAccount: { type: mongoose.Schema.Types.ObjectId },
		parentAccount: { type: mongoose.Schema.Types.ObjectId },
		accountCode: { type: String, trim: true, index: true, unique: true },
		code: { type: String, trim: true, required: true, index: true },
		name: { type: String, trim: true, required: true, index: true },
		hasChilderen: { type: Boolean, default: false, index: true },
		level: { type: Number, default: 0, index: true },
		debit: { type: Number, default: 0, index: true },
		credit: { type: Number, default: 0, index: true },
		balance: { type: Number, default: 0, index: true },
		quantityInput: { type: Number, default: 0, index: true },
		quantityOutput: { type: Number, default: 0, index: true },
		quantityBalance: { type: Number, default: 0, index: true },
		reports: {},
		createdDate: { type: Date, default: Date.now, index: true },
		modifiedDate: { type: Date, default: Date.now, index: true }
	})

	schema.pre('save', function(next) {
		if(this.parentAccount) {
			dbModel.conn.model('accounts').findOne({ _id: this.parentAccount }, (err, parentDoc) => {
				if(!err) {
					if(parentDoc != null) {
						this.accountCode = parentDoc.accountCode + '.' + this.code
						this.level=(parentDoc.level || 0)+1
					}
				} else {
					return next(new Error({ name: err.name, message: err.message }))
				}
				let mainAccountCode = this.accountCode.substr(0, 3)
				dbModel.conn.model('accounts').findOne({ accountCode: mainAccountCode }, (err, mainDoc) => {
					if(!err) {
						if(mainDoc != null) {
							this.mainAccount = mainDoc._id
							dbModel.conn.model('accounts').find({ parentAccount: this._id }).count((err, c) => {
								if(c > 0) {
									this.hasChilderen = true
								} else {
									this.hasChilderen = false
								}
								next()
							})

						} else {
							next(new Error({ name: 'MAIN_ACCOUNT_NOT_FOUND', message: `'${mainAccountCode}' Ana hesap bulunamadi` }))
						}

					} else {
						next(err)
					}
				})

			})
		} else {
			this.accountCode = this.code
			if(this.accountCode.length != 3) {
				return next(new Error({ name: 'SYNTAX_ERROR', message: 'Ana hesaplar 3 Karakter olmalıdır' }))
			}
			this.level=0
			this.mainAccount = this._id
			dbModel.conn.model('accounts').find({ parentAccount: this._id }).count((err, c) => {
				if(c > 0) {
					this.hasChilderen = true
				} else {
					this.hasChilderen = false
				}
				next()
			})
		}
	})

	schema.pre('remove', (next) => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', (model) => {})
	schema.plugin(mongoosePaginate)
	let model = dbModel.conn.model(collectionName, schema)
	model.removeOne = (member, filter, cb) => { sendToTrash(dbModel, collectionName, member, filter, cb) }
	model.relations = { accounts: 'parentAccount', parties: 'account' }

	return model
}