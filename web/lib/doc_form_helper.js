exports.makeSimpleInvoiceList = function(doc) {
	var newDoc = {
		_id: doc._id,
		uuid: doc.uuid,
		invoiceNo: '<b>' + (doc.ID == '' ? '' : doc.ID) + (doc.localDocumentId != '' ? ' | ' + doc.localDocumentId : '') + '</b><br>',
		issueDate: doc.issueDate + '<br>' + doc.issueTime,
		partyName: '<b>' + doc.accountingParty.title + '</b><br><span class="text-primary">' + doc.accountingParty.vknTckn + '</span> | Fatura Satır:' + doc.lineCountNumeric,
		amount: '<b>' + Number(doc.payableAmount).formatMoney(2, ',', '.') + '</b> <span class="small"><b>' + (doc.documentCurrencyCode == 'TRY' ? 'TL' : doc.documentCurrencyCode) + '</b></span><br><span title="Vergiler hariç tutar:' + Number(doc.taxExclusiveAmount).formatMoney(2, ',', '.') + '">V.H:' + Number(doc.taxExclusiveAmount).formatMoney(2, ',', '.') + '</span>',
		tax: '',
		currency: doc.documentCurrencyCode + (doc.documentCurrencyCode != 'TRY' ? '<br>Kur:' + doc.exchangeRate : ''),
		invoiceStatus: '',
		doc: doc
	}

	try {
		newDoc.issueDate = doc.issueDate + '<br>' + (new Date(doc.issueDate + 'T' + doc.issueTime)).hhmmss();
	} catch (err) {

	}

	newDoc.invoiceNo += badgeSpan(doc.profileId, staticValues.eInvoiceProfileIdList)
	newDoc.invoiceNo += badgeSpan(doc.invoiceTypeCode, staticValues.eInvoiceTypeCodeList, 'ml-1')

	if (doc.invoiceStatus != 'Error') {
		newDoc.invoiceStatus = badgeSpan(doc.invoiceStatus, staticValues.eInvoiceStatusTypes)
	} else {
		newDoc.invoiceStatus = badgeSpanStatic(`<a href="javascript:showErrors('${doc._id}'');"><i class="fa fa-eye"></i> Hata</a>`, 'error')
	}

	if (doc.taxSummary.vat1 > 0) {
		newDoc.tax += '1% = ' + Number(doc.taxSummary.vat1).formatMoney(',', '.') + '<br>';
	}
	if (doc.taxSummary.vat8 > 0) {
		newDoc.tax += '8% = ' + Number(doc.taxSummary.vat8).formatMoney(',', '.') + '<br>';
	}
	if (doc.taxSummary.vat18 > 0) {
		newDoc.tax += '18% = ' + Number(doc.taxSummary.vat18).formatMoney(',', '.') + '<br>';
	}
	if (doc.withholdingTaxTotal > 0) {
		newDoc.tax += 'Tevkifat = ' + Number(doc.withholdingTaxTotal).formatMoney(',', '.') + '<br>';
	}
	return newDoc;
}



exports.makeSimpleOrderList = function(doc) {
	var newDoc = {
		_id: doc._id,
		uuid: doc.uuid,
		orderNo: '<b>' + (doc.ID == '' ? '' : doc.ID) + (doc.localDocumentId != '' ? ' | ' + doc.localDocumentId : '') + '</b><br>',
		issueDate: doc.issueDate + '<br>' + doc.issueTime,
		partyName: '<b>' + doc.party.title + '</b><br><span class="text-primary">' + doc.party.vknTckn + '</span> | Satır sayısı:' + doc.lineCountNumeric,
		amount: '<b>' + Number(doc.payableAmount).formatMoney(2, ',', '.') + '</b> <span class="small"><b>' + (doc.documentCurrencyCode == 'TRY' ? 'TL' : doc.documentCurrencyCode) + '</b></span><br><span title="Vergiler hariç tutar:' + Number(doc.taxExclusiveAmount).formatMoney(2, ',', '.') + '">V.H:' + Number(doc.taxExclusiveAmount).formatMoney(2, ',', '.') + '</span>',
		tax: '',
		currency: doc.documentCurrencyCode + (doc.documentCurrencyCode != 'TRY' ? '<br>Kur:' + doc.exchangeRate : ''),
		orderStatus: '',
		doc: doc
	}

	try {
		newDoc.issueDate = doc.issueDate + '<br>' + (new Date(doc.issueDate + 'T' + (doc.issueTime || '00:00:00+03:00'))).hhmmss();
	} catch (err) {

	}

	newDoc.orderNo += '<span class="badge badge-status ';
	switch (doc.profileId) {
		case 'TEMELSIPARIS':
			newDoc.orderNo += 'status-temel">Temel';
			break;
		case 'TICARISIPARIS':
			newDoc.orderNo += 'status-ticari">Ticari';
			break;
		default:
			newDoc.orderNo += 'status-earsiv">' + doc.profileId + '';
			break;
	}
	newDoc.orderNo += '</span><span class="badge badge-status ml-1 ';

	switch (doc.orderTypeCode) {
		case 'SATIS':
			newDoc.orderNo += 'status-satis">Satış';
			break;
		case 'IADE':
			newDoc.orderNo += 'status-iade">İade';
			break;
		case 'TEVKIFAT':
			newDoc.orderNo += 'status-tevkifat">Tevkifat';
			break;
		case 'ISTISNA':
			newDoc.orderNo += 'status-istisna">İstisna';
			break;
		case 'OZELMATRAH':
			newDoc.orderNo += 'status-ozelmatrah">Özel Matrah';
			break;
		case 'IHRACKAYITLI':
			newDoc.orderNo += 'status-ihrackayitli">İhraç Kayıtlı';
			break;
		default:
			newDoc.orderNo += 'status-ihrackayitli">' + doc.orderTypeCode + '';
			break;
	}
	newDoc.orderNo += '</span>'

	newDoc.orderStatus = '<span class="badge badge-status ';
	switch (doc.orderStatus) {
		case 'Draft':
			newDoc.orderStatus += 'status-draft">Taslak';
			break;
		case 'Pending':
			newDoc.orderStatus += 'status-pending">Kuyruğa alındı';
			break;
		case 'Processing':
			newDoc.orderStatus += 'status-processing">İşleniyor';
			break;
		case 'SentToGib':
			newDoc.orderStatus += 'status-senttogib">GİB\'e iletildi';
			break;
		case 'Approved':
			newDoc.orderStatus += 'status-approved">Onaylandı';
			break;
		case 'Declined':
			newDoc.orderStatus += 'status-declined">Reddedildi';
			break;
		case 'WaitingForApprovement':
			newDoc.orderStatus += 'status-waitingforapprovement">Onay bekliyor';
			break;
		case 'Error':
			newDoc.orderStatus += 'status-error"><a href="javascript:showErrors(\'' + doc._id + '\');"><i class="fa fa-eye"></i> Hata</a>';
			break;
		default:
			newDoc.orderStatus += 'status-processing">' + doc.orderStatus + '';
			break;
	}
	newDoc.orderStatus += '</span>';
	if (doc.taxSummary.vat1 > 0) {
		newDoc.tax += '1% = ' + Number(doc.taxSummary.vat1).formatMoney(',', '.') + '<br>';
	}
	if (doc.taxSummary.vat8 > 0) {
		newDoc.tax += '8% = ' + Number(doc.taxSummary.vat8).formatMoney(',', '.') + '<br>';
	}
	if (doc.taxSummary.vat18 > 0) {
		newDoc.tax += '18% = ' + Number(doc.taxSummary.vat18).formatMoney(',', '.') + '<br>';
	}
	if (doc.withholdingTaxTotal > 0) {
		newDoc.tax += 'Tevkifat = ' + Number(doc.withholdingTaxTotal).formatMoney(',', '.') + '<br>';
	}
	return newDoc;
}



exports.makeSimpleDespatchList = function(doc) {
	var newDoc = {
		_id: doc._id,
		uuid: doc.uuid,
		despatchNo: '<b>' + (doc.ID == '' ? '' : doc.ID) + (doc.localDocumentId != '' ? ' | ' + doc.localDocumentId : '') + '</b><br>',
		issueDate: doc.issueDate + '<br>' + doc.issueTime,
		partyName: `<b>${doc.party.title}</b><br><span class="text-primary">${doc.party.vknTckn}</span> | Satır:${doc.lineCountNumeric}`,
		despatchStatusHtml: '',
		despatchStatus: doc.despatchStatus,
		receiptStatusHtml: '',
		receiptStatus: doc.receiptAdvice.receiptStatus,
		doc: doc
	}

	try {
		if (doc.receiptAdvice._id != '') {
			newDoc.partyName += `<br>TMiktar:<b>${doc.totalDeliveredQuantity}</b> | <b class="text-primary">Kabul:${doc.receiptAdvice.totalReceivedQuantity}</b> / <b class="text-danger">Red:${doc.receiptAdvice.totalRejectedQuantity}</b>`
		} else {
			newDoc.partyName += ` | <b>TMiktar:${doc.totalDeliveredQuantity}</b>`
		}
		newDoc.issueDate = doc.issueDate + '<br>' + (new Date(doc.issueDate + 'T' + (doc.issueTime || '00:00:00+03:00'))).hhmmss();
	} catch (err) {
		console.log(`makeSimpleDespatchList err:`, err)
	}

	newDoc.despatchNo += badgeSpan(doc.profileId, staticValues.despatchProfileIdList)
	newDoc.despatchNo += badgeSpan(doc.despatchAdviceTypeCode, staticValues.despatchAdviceTypeCodeList, 'ml-1')

	if (doc.despatchStatus != 'Error') {
		newDoc.despatchStatusHtml = badgeSpan(doc.despatchStatus, staticValues.despatchStatusTypes)
	} else {
		newDoc.despatchStatusHtml = badgeSpanStatic(`<a href="javascript:showErrors('${doc._id}'');"><i class="fa fa-eye"></i> Hata</a>`, 'error')
	}

	if (doc.ioType == 1) {
		newDoc.receiptStatusHtml = `<a class="btn btn-sm btn-info" href="javascript:setReceiptAdviceInformation('${doc._id}');" title="Teslim alındı bilgisi girişi"><i class="fas fa-truck-loading"></i></a>&nbsp;`
		if (doc.despatchStatus == 'Approved' && (doc.receiptAdvice.receiptStatus == 'OnTheWay' || doc.receiptAdvice.receiptStatus == 'Error')) {
			newDoc.receiptStatusHtml += badgeSpanStatic('Başarılı(A)', 'success')
		} else {
			if (doc.receiptAdvice.receiptStatus != 'Error') {
				newDoc.receiptStatusHtml += badgeSpan(doc.receiptAdvice.receiptStatus, staticValues.receiptStatusTypes)
			} else {
				newDoc.receiptStatusHtml += badgeSpanStatic(`<a href="javascript:showReceiptErrors('${doc.receiptAdvice._id}'');"><i class="fa fa-eye"></i> Hata</a>`, 'error')
			}
		}
	}
	return newDoc
}


exports.makeSimpleInventoryFicheList = function(doc) {
	var newDoc = {
		_id: doc._id,
		docId: '<b>' + doc.docId + '</b><br>',
		issueDate: doc.issueDate + '<br>' + (doc.issueTime || '').substr(0, 5),
		description: doc.description,
		subLocation: doc.location.locationName + (doc.subLocation.name ? '.' + doc.subLocation.name : ''),
		subLocation2: doc.docTypeCode == 'TRANSFER' ? doc.location2.locationName + (doc.subLocation2.name ? '.' + doc.subLocation2.name : '') : ''
	}


	newDoc.docId += '<span class="badge badge-status ';
	switch (doc.docTypeCode) {
		case 'TRANSFER':
			newDoc.docId += 'status-temel">Transfer';
			break;
		case 'GIRIS':
			newDoc.docId += 'status-iade">Giriş';
			break;
		case 'CIKIS':
			newDoc.docId += 'status-satis">Çıkış';
			break;
		case 'SAYIMFAZLASI':
			newDoc.docId += 'status-ihrackayitli">Sayım Fazlası(-)';
			break;
		case 'SAYIMEKSIGI':
			newDoc.docId += 'status-istisna">Sayım Eksiği(+)';
			break;
		case 'URETIMECIKIS':
			newDoc.docId += 'status-ozelmatrah">Üretime Çıkış';
			break;
		case 'URETIMDENGIRIS':
			newDoc.docId += 'status-ticari">Üretimden Giriş';
			break;
		case 'SAYIM':
			newDoc.docId += 'status-tevkifat">Sayım';
			break;
	}
	newDoc.docId += '</span>';

	if (doc.docTypeCode == 'URETIMECIKIS' || doc.docTypeCode == 'URETIMDENGIRIS') {
		//console.log('doc.productionOrderId:',doc.productionOrderId);

		// if((doc.productionOrderId || '')!=''){
		if (doc.productionOrderId) {
			newDoc.docId += '<span class="badge badge-status status-iade ml-1">';
			newDoc.docId += doc.productionOrderId.productionId;
			newDoc.docId += '</span>';
		}
	}

	return newDoc;
}



exports.makeSimpleProductionOrderList = function(req, doc) {
	try {
		var plannedPeriod = `<span title="${mrutil.haftaninGunu((doc.plannedPeriod.startDate || ''))}">${doc.plannedPeriod.startDate || ''}</span> ${doc.plannedPeriod.startTime || ''}`
		if (doc.plannedPeriod.startDate != doc.plannedPeriod.endDate) {
			plannedPeriod += `<br><span title="${mrutil.haftaninGunu((doc.plannedPeriod.endDate || ''))}">${doc.plannedPeriod.endDate || ''}</span> ${doc.plannedPeriod.endTime || ''}`
		}



		var newDoc = {
			_id: doc._id,
			productionId: `<b>${doc.productionId}</b><br>`,
			issueDate: doc.issueDate,
			plannedPeriod: plannedPeriod,
			itemName: `<span class="text-primary"><b>${(doc.item || '')!=''?doc.item.name.value:'---'}</b></span><br><b>${(doc.item || '')!=''?doc.item.description.value:'---'}</b>`,
			quantity: `${Number(doc.plannedQuantity).formatQuantity()} ${(doc.producedQuantity>0?'<span class="text-primary">/Ü:' + Number(doc.producedQuantity).formatQuantity() + ' ' + doc.unitCode + '</span>':'')} ${doc.unitCode}`,
			musteri: '',
			ambalaj: '',
			status: '',
			islemButonlari: '',
			doc: doc
		}


		newDoc.productionId += `<span class="badge badge-status `
		switch (doc.productionTypeCode) {
			case 'DEPO':
				newDoc.productionId += `status-temel">Depo`
				break
			default:
				newDoc.productionId += `status-ticari">${doc.productionTypeCode}`
				break
		}
		newDoc.productionId += `</span>`


		newDoc.status = '<span class="badge badge-status ';
		switch (doc.status) {
			case 'Draft':
				newDoc.status += 'status-draft">Taslak';
				break;
			case 'Approved':
				newDoc.status += 'status-approved">Onaylandı';
				break;
			case 'Declined':
				newDoc.status += 'status-declined">Reddedildi';
				break;
			case 'Processing':
				newDoc.status += 'status-processing">Üretiliyor';
				break;
			case 'Completed':
				newDoc.status += 'status-senttogib">Bitti';
				break;
			case 'Cancelled':
				newDoc.status += 'status-earsiv">İptal';
				break;
			case 'Error':
				newDoc.status += 'status-error"><a href="javascript:showErrors(\'' + doc._id + '\');"><i class="fa fa-eye"></i> Hata</a>';
				break;
			default:
				newDoc.status += 'status-processing">' + doc.status + '';
				break;
		}
		newDoc.status += '</span>';


		if (doc.productionTypeCode == 'MUSTERI') {
			if (doc.orderLineReference) {
				doc.orderLineReference.forEach((e2, index) => {
					newDoc.musteri += '<b>' + e2.orderReference.buyerCustomerParty.party.partyName.name.value + '</b>';
					if (index < doc.orderLineReference.length - 1) {

						newDoc.musteri += ' <span class="text-primary"><b>' + Number(e2.producedQuantity.value).formatQuantity() + '</b></span>';
						newDoc.musteri += '<br>';
					}
				});
			}
		}

		var paletStr = '';
		var ambalajStr = '';
		if ((doc.totalPallet || 0) > 0) paletStr += doc.totalPallet;
		//if((doc.palletType || '')!='')	paletStr += ' x ' + doc.palletType.name;

		if ((doc.totalPacking || 0) > 0) ambalajStr += doc.totalPacking;
		//if((doc.packingType || '')!='')	ambalajStr += ' x ' + doc.packingType.name;
		//qwerty palet/ paket turleri buraya gelsin
		newDoc.ambalaj += '<b>' + paletStr + '<br>' + ambalajStr + '</b>';

		switch (doc.status) {
			case 'Draft':
				newDoc.islemButonlari = '<a class="btn btn-secondary" href="/mrp/production-orders/approvement/' + doc._id + '?db=' + req.query.db + '&sid=' + req.query.sid + '" target="_self" title="Üretim emrini onayla veya reddet"><i class="fas fa-check-square"></i> Onay/Ret</a>';
				break;
			case 'Approved':
				newDoc.islemButonlari = '<a class="btn status-istisna" href="/mrp/production-orders/start/' + doc._id + '?db=' + req.query.db + '&sid=' + req.query.sid + '" target="_self" title="Üretim işlemini başlat"><i class="fas fa-play-circle"></i> Başlat</a>';
				break;
			case 'Processing':
				newDoc.islemButonlari = '<a class="btn status-earsiv" href="/mrp/production-orders/complete/' + doc._id + '?db=' + req.query.db + '&sid=' + req.query.sid + '" target="_self" title="Üretim işlemini tamamla/bitir"><i class="fas fa-stop-circle"></i> Bitir</a>';
				break;
		}
		return newDoc
	} catch (tryErr) {
		console.error(`makeSimpleProductionOrderList tryError:`, tryErr)
	}
}

function statusBadgeCssClass(status) {
	switch (status) {
		case 'Draft':
			return 'status-draft'
		case 'Pending':
			return 'status-pending'
		case 'Queued':
			return 'status-queued'
		case 'Processing':
			return 'status-processing'
		case 'SentToGib':
			return 'status-senttogib'
		case 'Success':
			return 'status-success'
		case 'Error':
			return 'status-error'
		case 'Deleted':
			return 'status-deleted'
		case 'Canceled':
			return 'status-canceled'
		case 'Approved':
			return 'status-approved'
		case 'PartialApproved':
			return 'status-partial-approved'
		case 'Declined':
			return 'status-declined'
		case 'WaitingForApprovement':
			return 'status-waitingforapprovement'
		case 'IHRACKAYITLI':
			return 'status-ihrackayitli'
		case 'OZELMATRAH':
			return 'status-ozelmatrah'
		case 'ISTISNA':
			return 'status-istisna'
		case 'TEVKIFAT':
			return 'status-tevkifat'
		case 'IADE':
			return 'status-iade'
		case 'SATIS':
		case 'SEVK':
			return 'status-satis'
		case 'EARSIVFATURA':
			return 'status-earsiv'
		case 'YOLCUBERABERFATURA':
			return 'status-yolcuberaber'
		case 'IHRACAT':
			return 'status-ihracat'
		case 'TICARIFATURA':
		case 'TICARISIPARIS':
			return 'status-ticari'
		case 'TEMELFATURA':
		case 'TEMELIRSALIYE':
		case 'TEMELSIPARIS':
			return 'status-temel'

		case 'OnTheWay':
			return 'status-ontheway'
		default:
			return 'status-default'
	}
}

function badgeSpan(status, list, additionalClass = '') {

	var text = (list.find((e) => { if (e.value == (status || '')) return e.text }) || { text: (status || '') }).text
	var str = `<span class="badge badge-status ${statusBadgeCssClass(status)} ${additionalClass}">${text}</span>`
	return str
}

function badgeSpanStatic(text, statusClass, additionalClass = '') {
	var str = `<span class="badge badge-status status-${statusClass} ${additionalClass}">${text}</span>`
	return str
}