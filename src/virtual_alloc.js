try {
    Module.load('KERNEL32.DLL');
} catch (err) {
    console.log(err);
}
try {
    var vpExportAddress = Module.getExportByName("KERNEL32.dll", "VirtualProtect");
    var vaExportAddress1 = Module.getExportByName("KERNEL32.dll", "VirtualAlloc");
} catch (err) {
    console.log(err);
}

Interceptor.attach(vpExportAddress, 
{   
    onEnter: function (args){
        var vpAddress = args[0];
        var vpSize = args[1].toInt32();
        var vpProtect = args[2];
        console.log("\nVirtualProtect called!");
        console.log("\tAddress: " + vpAddress);
        console.log("\tSize: " + vpSize);
        console.log("\tNew Protection: " + vpProtect);
        console.log("\n" + hexdump(vpAddress));
        if (vpAddress.readAnsiString(2) == "{BYTES_TO_SCAN_FOR}"){
            var someBinData = vpAddress.readByteArray(vpSize);
            var filename = vpAddress +"_{BYTES_TO_SCAN_FOR}.bin";
            var file = new File(filename, "wb");        
            file.write(someBinData);
            file.flush();
            file.close();
            console.log("\nDumped file: " + filename);
        }
    }
});
// Add a new interceptor for VirtualAlloc
var memRegions = [];
Interceptor.attach(vaExportAddress1, 
{   
    onEnter: function (args){
        
        this.vaSize = args[1].toInt32();
        var vaProtect = args[3];
            console.log("\nVirtualAlloc called => Size: " + this.vaSize + " | Protection: " + vaProtect);
        for(var i = 0; i < memRegions.length; i++)
        {
            
            console.log("\nChecking memory at " + memRegions[i].memBase.toString());
            console.log("\tVirtualAlloc called!");
            console.log(hexdump(memRegions[i].memBase));
            console.log("\tSize: " + this.vaSize);
            console.log("\tProtection: " + vaProtect);
        
            try {
                var firstBytes = memRegions[i].memBase.readAnsiString(2);
                } catch(err) {
                console.log(err);
                }
                
            if (firstBytes == "{BYTES_TO_SCAN_FOR}") {
                console.log("\tFound a {BYTES_TO_SCAN_FOR}!\\n");
                
                
                var vaBinData = memRegions[i].memBase.readByteArray(memRegions[i].memSize);
                var filename2 = memRegions[i].memBase + "_{BYTES_TO_SCAN_FOR}.bin";
                var file2 = new File(filename2, "wb");        
                file2.write(vaBinData);
                file2.flush();
                file2.close();
                console.log("\nDumped file: " + filename2);
            } 
        }
        
    },
    onLeave: function (retval) {
            console.log("\nVirtualAlloc returned => Address: " + retval);
            memRegions.push({memBase:ptr(retval), memSize:this.vaSize});
    }
});