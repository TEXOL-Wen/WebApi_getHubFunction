function handleTriggerClick(name) {
	console.log("handleTriggerClick()");
	//alert('Trigger clicked for item: ' + name);
	//get SensorID by core-data
	let checkCount = 100;
	if (UsingDocker == 1) {
		urlIn = "core-data:59880/api/v2/reading/device/name/" + name + "?offset=0&limit=" + checkCount; //core-data :59880
	} else
		urlIn = ":59880/api/v2/reading/device/name/" + name + "?offset=0&limit=" + checkCount; //用來撈MQTT Bridge用的 需要上線

	ReadURL(urlIn)
		.then(result => { //ready get
			let Device_ID = name;
			let Module_Name = "";
			let Sensor_ID = "";
			let Bridge_UUID = "";
			let Channel = "";
			let Pipe = "";
			let BLEFWVersion = "";
			let BLE_UUID = "";
			let CheckDataCount = 0;
			console.log(result); // 处理获取的数据
			
			for (var i = 0; i < checkCount; i++) {
				//主要篩選MQTT設備
				if (result.readings[i] && result.readings[i].resourceName == "Module_Name" && result.readings[i].value) {
					Module_Name = result.readings[i].value;
					CheckDataCount++;
				}
				else if (result.readings[i] && result.readings[i].resourceName == "Sensor_ID" && result.readings[i].value) {
					Sensor_ID = result.readings[i].value;
					CheckDataCount++;
				}
				else if (result.readings[i] && result.readings[i].resourceName == "BLE_UUID" && result.readings[i].value) {
					BLE_UUID = result.readings[i].value;
					CheckDataCount++;
				}
				else if (result.readings[i] && result.readings[i].resourceName == "Pipe" && result.readings[i].value) {
					Pipe = result.readings[i].value;
					CheckDataCount++;
				}
				else if (result.readings[i] && result.readings[i].resourceName == "Channel" && result.readings[i].value) {
					Channel = result.readings[i].value;
					CheckDataCount++;
				}
				else if (result.readings[i] && result.readings[i].resourceName == "Hub_UUID" && result.readings[i].value) {
					Bridge_UUID = result.readings[i].value;
					CheckDataCount++;
				}
				else if (result.readings[i] && result.readings[i].resourceName == "BLE_FW_Version" && result.readings[i].value) {
					BLEFWVersion = result.readings[i].value;
					CheckDataCount++;
				}
		

				//主要篩選RS485設備
				if (result.readings[i] && result.readings[i].profileName.includes("213MM2-R1")  && result.readings[i].value) {
					Module_Name = "213MM2-R1";
					console.log("Found R1");
				}else if (result.readings[i] && result.readings[i].profileName.includes("213MM2-R0")  && result.readings[i].value) {
					Module_Name = "213MM2-R0";
					console.log("Found R0");
				}
				
				window.DeviceCheck = 0;
                //檢查到最後，篩選資訊選擇相應設備的觸發函式
				if (i == (checkCount - 1)) {
					console.log("Click Module Name:",Module_Name);
					//不完整的MQTT單軸資訊
					if (CheckDataCount < 7 && Module_Name != "213MM2-R1" && Module_Name != "213MM2-R0" && Module_Name != "213MM1-B1") {
						if((Sensor_ID!="") && (Module_Name!="")){ //有Sensor_ID起碼還可以預存config
							alert(Device_ID + " 無法取得完整MQTT HUB資訊，可能是因為下線了!");
							window.DeviceCheck = 0;
							MQTTdevice0_CreatPage(Device_ID, Sensor_ID, Bridge_UUID, BLE_UUID, Channel, Pipe, BLEFWVersion);
						}else{
							alert(Device_ID + "在MQTT HUB找不到Sensor ID，無法設定!");
						}
					}//完整的MQTT單軸資訊 
					else if (Module_Name != null && Module_Name == "211HM1-B1") {
						window.DeviceCheck = 1;
						MQTTdevice0_CreatPage(Device_ID, Sensor_ID, Bridge_UUID, BLE_UUID, Channel, Pipe, BLEFWVersion);

					}//不完整的MQTT三軸資訊
					else if (CheckDataCount < 7 && Module_Name != "213MM2-R1" && Module_Name != "211HM1-B1") {
						if((Sensor_ID!="") && (Module_Name!="")){ //有Sensor_ID起碼還可以預存config
							alert(Device_ID + " 無法取得完整MQTT HUB資訊，可能是因為下線了!");
							window.DeviceCheck = 0;
							MQTTdevice1_CreatPage(Device_ID, Sensor_ID, Bridge_UUID, BLE_UUID, Channel, Pipe, BLEFWVersion);
						}else{
							alert(Device_ID + "在MQTT HUB找不到Sensor ID，無法設定!");
						}
					}//完整的MQTT3軸資訊 
					else if (Module_Name != null && Module_Name == "213MM1-B1") {
						//add device configuration page
						window.DeviceCheck = 1;
						MQTTdevice1_CreatPage(Device_ID, Sensor_ID, Bridge_UUID, BLE_UUID, Channel, Pipe, BLEFWVersion);

					}
					 else if (Module_Name != null && Module_Name == "213MM2-R1") {
						console.log("Select 213MM2-R1:",Device_ID,Sensor_ID);
						alert("Device ID: " + Device_ID + "\r\n" + "Sensor ID : " + Sensor_ID + "\r\n");
						MQTTdevice3_CreatPage(Device_ID);
						//alert("尚未開發完成");
						

					} else if (Module_Name != null && Module_Name == "213MM2-R0") {
						console.log("Select 213MM2-R0:",Device_ID,Sensor_ID);
						alert("Device ID: " + Device_ID + "\r\n" + "Sensor ID : " + Sensor_ID + "\r\n");
						//alert("尚未開發完成");
					}
				}
			}

		})
		.catch(error => {
			console.error('無法查詢所有設備資訊:', error);
		});

}
