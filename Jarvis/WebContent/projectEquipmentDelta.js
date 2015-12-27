project = portfolio.addProject(createEquipmentDelta());
function createEquipmentDelta() {
	var project = new Project();
	
	project.application = "EquipmentDelta";
	project.short = "EQD";
	project.version = "1.0";
	project.name = project.application + " " + project.version;
	project.setStartDate("2.1.2015");
	project.setEndDate("30.10.2015");
	
	project.newMilestone("M3", "25.1.2015");
	project.newMilestone("M5", "25.2.2015");
	project.newMilestone("M7", "25.3.2015");
	project.newMilestone("M9", "25.4.2015");
	project.newMilestone("M10", "25.5.2015");
	project.newMilestone("M11", "25.6.2015");
	project.newMilestone("M13", "25.7.2015");
	project.newMilestone("M14", "25.8.2015");
	
	var json1 = '{ "class": "Project", "application": "EquipmentDelta", "test2":"TEST2"}';
	
	var o = JSON.parse(json1, reviver);
	
	function reviver(key, value) {
		this.lastkey = key;
		if (key == "") {
			return new Project();
		} else {
			return value;
		}
	}
	return project;
}