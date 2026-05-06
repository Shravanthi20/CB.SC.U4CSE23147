function optimize(vehicles, hours){
    new_vehicles= vehicles.sort((a,b)=>{
    if(a['Impact']>b['Impact']){
        return 1;
    }
    else if(a['Impact']<b['Impact']){
        return -1;
    }
    else{
        return 0;
    }
    });
    let total_hours=0
    let idx=0
    for(let vehicle in vehicles){
        if(vehicle['Duration']+total_hours>hours){
            console.log(idx);
            return vehicles.slice(0,idx);
        }
        idx=idx+1;
        total_hours= vehicle['Duration']+total_hours;
    }
}