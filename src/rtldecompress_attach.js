try {
    Module.load('NTDLL.DLL');
} catch (err) {
    console.log(err);
}
try {
    var vpExportAddress = Module.getExportByName("NTDLL.DLL", "RtlDecompressBuffer");
} catch (err) {
    console.log(err);
}
try {
    Interceptor.attach(vpExportAddress, 
    {   
        onEnter: function (args){
            this.vpAddress = args[1];
            this.vpSize = args[2].toInt32();
            console.log("\nRtlDecmpressBuffer called! " + this.vpAddress + ' Size is ' + this.vpSize);
            var someBinData = this.vpAddress.readByteArray(this.vpSize);
            var filename = vpAddress +"_rtl.bin";
            var file = new File(filename, "wb");        
            file.write(someBinData);
            file.flush();
            file.close();
            console.log("\\nDumped file: " + filename);
        },
        onLeave: function (retval){
            console.log("We returned");
        }
    });
} catch (err) {
    console.log(err);
}