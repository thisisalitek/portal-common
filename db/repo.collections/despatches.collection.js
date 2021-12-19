module.exports = function(dbModel) {
	let collectionName = path.basename(__filename, '.collection.js')
	let schema = mongoose.Schema({
		ioType: { type: Number, default: 0, index: true },
		eIntegrator: { type: mongoose.Schema.Types.ObjectId, ref: 'integrators', mdl: dbModel['integrators'], required: true, index: true },
		location: { type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl: dbModel['locations'], index: true },
		location2: { type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl: dbModel['locations'], index: true },
		profileId: {
			value: { type: String, default: '', trim: true, enum: ['TEMELIRSALIYE'], required: true, index: true }
		},
		ID: dbType.idType,
		uuid: dbType.valueType,
		issueDate: { value: { type: String, required: [true, 'Irsaliye tarihi gereklidir'], index: true } },
		issueTime: { value: { type: String, default: '00:00:00', minlength: [8, 'Saat degeri en az 8 karakter uzunlugunda olmalidir.'] } },
		despatchAdviceTypeCode: { value: { type: String, default: '', trim: true, enum: ['SEVK', 'MATBUDAN'], required: true, index: true } },
		despatchPeriod: dbType.periodType,
		note: [dbType.valueType],
		additionalDocumentReference: [],
		orderReference: [],
		originatorDocumentReference: [],
		despatchSupplierParty: {
			party: dbType.partyType,
			despatchContact: dbType.contactType
		},
		deliveryCustomerParty: {
			party: dbType.partyType,
			deliveryContact: dbType.contactType
		},
		originatorCustomerParty: {
			party: dbType.partyType,
			deliveryContact: dbType.contactType
		},
		sellerSupplierParty: {
			party: dbType.partyType,
			despatchContact: dbType.contactType
		},
		buyerCustomerParty: {
			party: dbType.partyType,
			deliveryContact: dbType.contactType
		},
		shipment: dbType.shipmentType,
		lineCountNumeric: dbType.numberValueType,
		despatchLine: [],
		receiptAdvice: { type: mongoose.Schema.Types.ObjectId, ref: 'despatches_receipt_advice', mdl: dbModel['despatches_receipt_advice'] },
		localDocumentId: { type: String, default: '' },
		despatchStatus: { type: String, default: 'Draft', enum: ['Deleted', 'Pending', 'Draft', 'Canceled', 'Queued', 'Processing', 'SentToGib', 'Approved', 'PartialApproved', 'Declined', 'WaitingForApprovement', 'Error'], index: true },
		despatchErrors: [{ _date: { type: Date, default: Date.now }, code: '', message: '' }],
		localStatus: { type: String, default: '', enum: ['', 'transferring', 'pending', 'transferred', 'error'], index: true },
		localErrors: [{ _date: { type: Date, default: Date.now }, code: '', message: '' }],
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now }
	})

	schema.pre('save', (next) => {

		next()
		// updateActions(dbModel,this,next)
	})

	schema.pre('remove', (next) => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', (model) => {})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)

	schema.index({ "ioType": 1 })
	schema.index({ "ID.value": 1 })
	schema.index({ "issueDate.value": 1 })
	schema.index({ "uuid.value": 1 })
	schema.index({ "eIntegrator": 1 })
	schema.index({ "profileId.value": 1 })
	schema.index({ "despatchAdviceTypeCode.value": 1 })
	schema.index({ "localDocumentId": 1 })
	schema.index({ "despatchStatus": 1 })
	schema.index({ "localStatus": 1 })
	schema.index({ "createdDate": 1 })

	let model = dbModel.conn.model(collectionName, schema)
	model.removeOne = (member, filter, cb) => { sendToTrash(dbModel, collectionName, member, filter, cb) }

	return model
}


function updateActions(dbModel, doc, next) {
	let index = 0

	function kaydet(cb) {
		if(index >= doc.despatchLine.length)
			return cb(null)
		if(doc.despatchLine[index].item._id) {
			let newActionDoc = new dbModel.actions(dbType.actionType)
			newActionDoc.actionType = 'despatch'
			newActionDoc.ioType = doc.ioType
			newActionDoc.actionCode = doc.despatchAdviceTypeCode.value
			newActionDoc.issueDate = doc.issueDate.value
			newActionDoc.issueTime = doc.issueTime.value
			newActionDoc.docId = doc._id
			newActionDoc.docNo = doc.ID.value
			newActionDoc.inventory.locationId = doc.location
			newActionDoc.inventory.locationId2 = doc.location
			newActionDoc.inventory.itemId = doc.despatchLine[index].item._id
			newActionDoc.inventory.quantity = doc.despatchLine[index].deliveredQuantity.value
			newActionDoc.description = ''
			newActionDoc.modifiedDate = new Date()

			newActionDoc.save((err, newActionDoc2) => {
				if(!err) {
					index++
					setTimeout(kaydet, 0, cb)
				} else {
					cb(err)
				}
			})

		} else {
			index++
			setTimeout(kaydet, 0, cb)
		}

	}

	dbModel.actions.deleteMany({ docId: doc._id }, (err, docs) => {
		if(err) {
			errorLog(err)
			next(err)
		} else {
			kaydet((err) => {
				if(err) {
					errorLog(err)

					next(err)
				} else {
					next()
				}
			})
		}
	})
}