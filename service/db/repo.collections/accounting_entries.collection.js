module.exports = function(dbModel) {
	let collectionName = path.basename(__filename, '.collection.js')
	let schema = mongoose.Schema({
		eIntegrator: {type: mongoose.Schema.Types.ObjectId, ref: 'integrators', mdl:dbModel['integrators'], required: false},
		ledger: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'accounting_ledgers', mdl: dbModel.accounting_ledgers },
		year: { type: Number, default: 0, index: true },
		period: { type: Number, default: 0, index: true },
		startDate: { type: String, default: '', index: true },
		endDate: { type: String, default: '', index: true },
		enteredBy: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
		entryNumber: { type: Number, default: 0, index: true },
		entryComment: { type: String, default: '', trim: true, index: true },
		batchId: { type: String, default: '', trim: true },
		batchDescription: { type: String, default: '', trim: true },
		totalDebit: { type: Number, default: 0, index: true },
		totalCredit: { type: Number, default: 0, index: true },
		documentType: { type: String, default: '',required: [true, 'Belge tipi zorunludur'], index: true },
		documentTypeDescription: { type: String, default: '', index: true },
		documentNumber: { type: String, default: '', index: true },
		documentDate: { type: String, required: [true, 'Belge tarihi zorunludur'], index: true },
		paymentMethod: { type: String, default: '', index: true },
		journalNumber: { type: Number, default: 0, index: true },
		lineCountNumeric: { type: Number, default: 0, index: true },
		entryLine: [{
			lineNo: { type: Number, default: 0, index: true },
			accountMain: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts},
			account: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl: dbModel.accounts },
			debit: { type: Number, default: 0, index: true },
			credit: { type: Number, default: 0, index: true },
			postingDate: { type: String, default: '' },
			detailComment: { type: String, default: '', index: true },
			journalLineNumber: { type: Number, default: 0, index: true },
			quantityInput: { type: Number, default: 0},
			quantityOutput: { type: Number, default: 0 }
		}],
		createdDate: { type: Date, default: Date.now, index: true },
		modifiedDate: { type: Date, default: Date.now, index: true }
	})

	schema.pre('save', (next) => {
		
		
		next()
	})
	schema.pre('remove', (next) => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', (model) => {})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	let model = dbModel.conn.model(collectionName, schema)
	model.removeOne = (member, filter, cb) => { sendToTrash(dbModel, collectionName, member, filter, cb) }
	model.relations = {}
	return model
}