module.exports = function(conn) {
	let collectionName = path.basename(__filename, '.collection.js')
	let schema = mongoose.Schema({
		imageid: { type: mongoose.Schema.Types.ObjectId, ref: 'images' },
		item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', default: null },
		member: { type: mongoose.Schema.Types.ObjectId, ref: 'portal_members', default: null },
		image: { type: String, default: '' },
		width: { type: Number, default: 0 },
		height: { type: Number, default: 0 },
		blur: { type: Boolean, default: false },
		uploaddate: { type: Date, default: Date('1900-01-01') },
		deleted: { type: Boolean, default: false },
		deleteddate: { type: Date, default: Date('1900-01-01') }
	})

	schema.pre('save', (next) => next())
	schema.pre('remove', (next) => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', (model) => {})
	schema.plugin(mongoosePaginate)

	let model = conn.model(collectionName, schema)

	model.removeOne = (member, filter, cb) => { sendToTrash(conn, collectionName, member, filter, cb) }
	return model
}