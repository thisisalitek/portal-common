exports.run=(dbModel, fileImporterId,data,callback)=>{
    findDefaultFileImporter(dbModel,fileImporterId,(err,fileImporterDoc)=>{
        if(!err){
            runRendered(fileImporterDoc,data,callback);
        }else{
            callback(err);
        }
    })
}


function runRendered(fileImporterDoc,data,cb){
    try{

        if(typeof data=='string'){
            try{
                if(data==''){
                    data={}
                }else{
                    data=JSON.parse(data);
                }
                
            }catch(err){
                errorLog('err:',err);
                return cb({code:'PARSING_ERROR',message:err.message});
            }
        }
        
        if(fileImporterDoc.startFile!=undefined){
            if(fileImporterDoc.startFile.data!=undefined && fileImporterDoc.startFile.extension=='ejs'){
                render(fileImporterDoc,data,(err,renderedCode)=>{
                    if(!err){
                       var fileName=path.join(os.tmpdir() , 'tr216_' + uuid.v4() + '.js');
                        fs.writeFile(fileName, renderedCode, 'utf8', (err)=>{
                            if(!err){
                                util.execCmd('node',[fileName,'-e'],(err,veri,stderr)=>{
                                    if(stderr.trim()==''){
                                        cb(null,veri);
                                    }else{
                                        cb({code:'cmd_JS_ERROR',message:stderr})
                                    }
                                })
                            }else{
                                cb({code:err.code || err.name || 'FILE_IMPORTER ERROR TEMP WRITE',message:err.message || 'FILE_IMPORTER ERROR TEMP WRITE' })
                            }
                        });
                    }else{
                        cb({code:err.name,message:err.message});
                    }
                });

                
            }else{
                
                cb({code:'START_FILE_ERROR',message:'startFile data yok veya uzantisi .ejs degil!'});
            }
            
        }else{
            cb({code:'START_FILE_ERROR',message:'startFile tanimlanmamis'});
        }
    }catch(tryErr){
        return cb({code:'PARSING_ERROR',message:err.message});
    }
}

function render(fileImporterDoc,data,cb){
    try{
        let ejs = require('ejs');
        var renderedCode='';
        var includeCode='';
        var code=fileImporterDoc.startFile.data;
        code=code.replaceAll('include(','includeLocal(');
        code=code.replaceAll('encodeURIComponent(','encodeURIComponent2(');

        //code +="\n";

        includeCode +="\n<% \nfunction includeLocal(fileName){ \n";
        includeCode +=" switch(fileName){  \n";
        fileImporterDoc.files.forEach((f)=>{
            if(fileImporterDoc.startFile._id.toString()!=f._id.toString()){
                includeCode +=" case '" + f.fileName + "' : \n";
                if(f.extension=='ejs') {
                    includeCode +=" case '" + f.name + "' : \n";
                    includeCode +="%>\n";
                    includeCode += f.data; // ejs.render(f.data,data);
                }else if(f.type=='text/plain' || f.type=='application/json' || f.type=='text/javascript'){
                    includeCode +="%>\n";
                    includeCode +=f.data;
                }
                includeCode +="<% break; \r\n";
            }
        });
        includeCode +=" default: %> \n";
        includeCode +=" ";
        includeCode +=" <% break;\n";
        includeCode +=" }\n";
        includeCode +="} %> \n";
        code=includeCode + code;
        

        renderedCode=ejs.render(code,data);
        
        cb(null,renderedCode);
    }catch(err){
        errorLog(err);
        
        cb({code:err.name || 'EJS_RENDER_ERROR' ,name:err.name || 'EJS_RENDER_ERROR',message: err.message || err.toString()});
    }
    
}

function findDefaultFileImporter(dbModel,fileImporterId,callback){
    
    var filter={passive:false}
    if(fileImporterId){
        filter['_id']=fileImporterId;
    }
    
    dbModel.file_importers.find(filter).populate(['startFile','files']).exec((err,docs)=>{
        if(!err){
            if(docs.length==0) return callback({code:'RECORD_NOT_FOUND',message:'Aktif file importer bulunamadi'});
            if(docs.length==1) return callback(null,docs[0]);
            var bFoundDefault=false;
            var foundDoc;
            docs.forEach((e)=>{
                if(e.isDefault){
                    bFoundDefault=true;
                    foundDoc=e;
                    return;
                }
            });
            if(bFoundDefault) return callback(null,foundDoc);
            callback(null,docs[0]);

        }else{
            callback(err);
        }
    });
}
