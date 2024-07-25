import { Injectable } from '@angular/core';

import { IIconRadioOption } from './models.service';
import { IconService } from './icon.service';

@Injectable()
export class PageBuilderService {
    accidentTypeOptions: () => IIconRadioOption[];

    //#region ========== Generic Options ===========
    yesNoOptions: () => IIconRadioOption[];
    goodFaultyUnknownOptions: () => IIconRadioOption[];
    yesNoNotApplicableOptions: () => IIconRadioOption[];
    yesNoUnknownOptions: () => IIconRadioOption[];
    noYesUnknownOptions: () => IIconRadioOption[];
    //#endregion ===================================

    //#region ========== All Other SNAP Options ==========
    vehicleTypeOptions: () => IIconRadioOption[];
    positionBeforeAccident: () => IIconRadioOption[];
    whatDriverWasDoingOptions: () => IIconRadioOption[];
    directionVehicleWasTravellingOptions: () => IIconRadioOption[];
    flatOrSlopedRoadOptions: () => IIconRadioOption[];
    roadSurfaceTypeOptions: () => IIconRadioOption[];
    roadTypeOptions: () => IIconRadioOption[];
    roadSurfaceConditionOptions: () => IIconRadioOption[];
    roadQualityOptions: () => IIconRadioOption[];
    directionOfRoadOptions: () => IIconRadioOption[];
    juntionTypeOptions: () => IIconRadioOption[];
    trafficControlTypeOptions: () => IIconRadioOption[];
    roadMarkingVisibilityOptions: () => IIconRadioOption[];
    roadSignConditionOptions: () => IIconRadioOption[];
    overtakingControlOptions: () => IIconRadioOption[];
    obstructionOptions: () => IIconRadioOption[];
    lightConditionOptions: () => IIconRadioOption[];
    weatherConditionOptions: () => IIconRadioOption[];
    vehicleDamageOptions: () => IIconRadioOption[];
    //#endregion =========================================

    //#region ========== SCAN Options ===========
    raceOptions: () => IIconRadioOption[];
    genderOptions: () => IIconRadioOption[];
    licenceTypeOptions: () => IIconRadioOption[];
    licenceCodeOptions: () => IIconRadioOption[];
    seatbeltUsedOptions: () => IIconRadioOption[];
    severityOfInjuryOptions: () => IIconRadioOption[];
    liqourDrugUseOptions: () => IIconRadioOption[];
    locationOfPedestrianOrCyclistOptions: () => IIconRadioOption[];
    whereWasPedestrianOrCyclistOptions: () => IIconRadioOption[];
    colorOfClothing: () => IIconRadioOption[];
    whatPedestrianWasDoingOptions: () => IIconRadioOption[];
    pedestrianOrCyclistManoeuvereOptions: () => IIconRadioOption[];
    //#endregion =================================

    //#region ========== SUBMIT Options ==========
    trappedOfFallenOutOptions: () => IIconRadioOption[];
    //#endregion =================================

    constructor(private icons: IconService) {
        this.setRadioOptions();
    }

    private setRadioOptions() {
        this.accidentTypeOptions = () => [
            { ID: 1, Description: 'Head / Rear end', Image: this.icons.ACCIDENT_TYPES.Rear_End },
            { ID: 2, Description: 'Head on', Image: this.icons.ACCIDENT_TYPES.Head_On },
            { ID: 3, Description: 'Sideswipe (opposite direction)', Image: this.icons.ACCIDENT_TYPES.Sideswipe_Opposite },
            { ID: 4, Description: 'Sideswipe (same direction)', Image: this.icons.ACCIDENT_TYPES.Sideswipe_Same },
            { ID: 5, Description: 'T-Bone', Image: this.icons.ACCIDENT_TYPES.T_Bone },
            { ID: 6, Description: 'Single vehicle', Image: this.icons.ACCIDENT_TYPES.Single_Vehicle },
            { ID: 7, Description: 'Overturned', Image: this.icons.ACCIDENT_TYPES.Overturned },
            { ID: 8, Description: 'With pedestrian', Image: this.icons.ACCIDENT_TYPES.With_Pedestrian },
            { ID: 9, Description: 'With animal', Image: this.icons.ACCIDENT_TYPES.With_Animal },
            { ID: 10, Description: 'With train', Image: this.icons.ACCIDENT_TYPES.With_Train },
            { ID: 11, Description: 'With fixed object', Image: this.icons.ACCIDENT_TYPES.With_Object },
            { ID: 12, Description: 'Other', Image: this.icons.COMMON.Other },
        ];

        //#region ========== Generic Options ===========
        this.goodFaultyUnknownOptions = () => [
            { ID: 1, Description: 'Yes', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'No', Image: this.icons.COMMON.Not_Good },
            { ID: 3, Description: 'Unknown', Image: this.icons.COMMON.Unknown }
        ];
        this.yesNoNotApplicableOptions = () => [
            { ID: 1, Description: 'Yes', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'No', Image: this.icons.COMMON.Not_Good },
            { ID: 3, Description: 'Not applicable', Image: this.icons.COMMON.Not_Applicable }
        ];
        this.yesNoUnknownOptions = () => [
            { ID: 1, Description: 'Yes', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'No', Image: this.icons.COMMON.Not_Good },
            { ID: 3, Description: 'Unknown', Image: this.icons.COMMON.Unknown }
        ];
        this.noYesUnknownOptions = () => [
            { ID: 1, Description: 'Yes', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'No', Image: this.icons.COMMON.Not_Good },
          
            { ID: 3, Description: 'Unknown', Image: this.icons.COMMON.Unknown }
        ];
        this.yesNoOptions = () => [
            { ID: 1, Description: 'Yes', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'No', Image: this.icons.COMMON.Not_Good }
        ];
        //#endregion ===================================

        //#region ========== All Other SNAP Options ==========
        this.vehicleTypeOptions = () => [
            { ID: 1, Description: 'Motor car', Image: this.icons.VEHICLE_TYPES.Motor_Car },
            { ID: 2, Description: 'Combi / Minibus', Image: this.icons.VEHICLE_TYPES.Minibus },
            { ID: 3, Description: 'Midibus', Image: this.icons.VEHICLE_TYPES.Midibus },
            { ID: 4, Description: 'Bus', Image: this.icons.VEHICLE_TYPES.Bus },
            { ID: 5, Description: 'Bus-train', Image: this.icons.VEHICLE_TYPES.Bus_Train },
            { ID: 6, Description: 'Light delivery vehicle', Image: this.icons.VEHICLE_TYPES.Light_Delivery },
            { ID: 7, Description: 'Panel van', Image: this.icons.VEHICLE_TYPES.Panel_Van },
            { ID: 8, Description: 'GVM > 3500kg', Image: this.icons.VEHICLE_TYPES.Gvm },
            { ID: 9, Description: 'Truck: articulated', Image: this.icons.VEHICLE_TYPES.Truck },
            { ID: 10, Description: 'Truck: articulated multiple', Image: this.icons.VEHICLE_TYPES.Truck_Multiple },
            { ID: 11, Description: '125cc and under', Image: this.icons.VEHICLE_TYPES.Cc125_And_Under },
            { ID: 12, Description: 'Above 125cc', Image: this.icons.VEHICLE_TYPES.Above_125cc },
            { ID: 13, Description: 'Tri-cycle', Image: this.icons.VEHICLE_TYPES.Tri_Cycle },
            { ID: 14, Description: 'Quadru-cucle', Image: this.icons.VEHICLE_TYPES.Quadru_Cycle },
            { ID: 15, Description: 'Bicycle', Image: this.icons.VEHICLE_TYPES.Bicycle },
            { ID: 16, Description: 'Mobile equipment', Image: this.icons.VEHICLE_TYPES.Mobile_Equipment },
            { ID: 17, Description: 'Caravan / Trailer', Image: this.icons.VEHICLE_TYPES.Caravan_Trailer },
            { ID: 18, Description: 'Tractor', Image: this.icons.VEHICLE_TYPES.Tractor },
            { ID: 19, Description: 'Animal-drawn vehicle', Image: this.icons.VEHICLE_TYPES.Animal_Drawn },
            { ID: 20, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.positionBeforeAccident = () => [
            { ID: 1, Description: 'Correct road lane', Image: this.icons.POSITION_BEFORE_ACCIDENT.Correct_Road_Lane },
            { ID: 2, Description: 'Wrong road lane', Image: this.icons.POSITION_BEFORE_ACCIDENT.Wrong_Road_Lane },
            { ID: 3, Description: 'Wrong side of road', Image: this.icons.POSITION_BEFORE_ACCIDENT.Wrong_Side_Of_Road },
            { ID: 4, Description: 'Road shoulder', Image: this.icons.POSITION_BEFORE_ACCIDENT.Road_Shoulder },
            { ID: 5, Description: 'On-road parking bay', Image: this.icons.POSITION_BEFORE_ACCIDENT.On_Road_Parking_Bay },
            { ID: 6, Description: 'Off-road parking bay', Image: this.icons.POSITION_BEFORE_ACCIDENT.Off_Road_Parking_Bay }
        ];
        this.whatDriverWasDoingOptions = () => [
            { ID: 1, Description: 'Turning right', Image: this.icons.WHAT_DRIVER_WAS_DOING.Turning_Right },
            { ID: 2, Description: 'Turning left', Image: this.icons.WHAT_DRIVER_WAS_DOING.Turning_Left },
            { ID: 3, Description: 'U-turn', Image: this.icons.WHAT_DRIVER_WAS_DOING.U_Turn },
            { ID: 4, Description: 'Enter traffic flow', Image: this.icons.WHAT_DRIVER_WAS_DOING.Enter_Traffic_Flow },
            { ID: 5, Description: 'Merging', Image: this.icons.WHAT_DRIVER_WAS_DOING.Merging },
            { ID: 6, Description: 'Diverging', Image: this.icons.WHAT_DRIVER_WAS_DOING.Diverging },
            { ID: 7, Description: 'Overtaking: pass to right', Image: this.icons.WHAT_DRIVER_WAS_DOING.Overtaking_Pass_Right },
            { ID: 8, Description: 'Overtaking: pass to left', Image: this.icons.WHAT_DRIVER_WAS_DOING.Overtaking_Pass_Left },
            { ID: 9, Description: 'Travelling straight', Image: this.icons.WHAT_DRIVER_WAS_DOING.Traveling_Straight },
            { ID: 10, Description: 'Reversing', Image: this.icons.WHAT_DRIVER_WAS_DOING.Reversing },
            { ID: 11, Description: 'Sudden start', Image: this.icons.WHAT_DRIVER_WAS_DOING.Sudden_Start },
            { ID: 12, Description: 'Sudden stop', Image: this.icons.WHAT_DRIVER_WAS_DOING.Sudden_Stop },
            { ID: 13, Description: 'Busy parking', Image: this.icons.WHAT_DRIVER_WAS_DOING.Busy_Parking },
            { ID: 14, Description: 'Changing lane', Image: this.icons.WHAT_DRIVER_WAS_DOING.Changing_Lanes },
            { ID: 15, Description: 'Swerving', Image: this.icons.WHAT_DRIVER_WAS_DOING.Swerving },
            { ID: 16, Description: 'Slowing down', Image: this.icons.WHAT_DRIVER_WAS_DOING.Slowing_Down },
            { ID: 17, Description: 'Avoiding object', Image: this.icons.WHAT_DRIVER_WAS_DOING.Avoiding_Object },
            { ID: 18, Description: 'Stationary', Image: this.icons.WHAT_DRIVER_WAS_DOING.Stationery },
            { ID: 19, Description: 'Parked', Image: this.icons.WHAT_DRIVER_WAS_DOING.Parked },
            { ID: 20, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.directionVehicleWasTravellingOptions = () => [
            { ID: 1, Description: 'North', Image: this.icons.VEHICLE_TRAVEL_DIRECTION.North },
            { ID: 2, Description: 'South', Image: this.icons.VEHICLE_TRAVEL_DIRECTION.South },
            { ID: 3, Description: 'East', Image: this.icons.VEHICLE_TRAVEL_DIRECTION.East },
            { ID: 4, Description: 'West', Image: this.icons.VEHICLE_TRAVEL_DIRECTION.West }
        ];
        this.flatOrSlopedRoadOptions = () => [
            { ID: 1, Description: 'Flat', Image: this.icons.FLAT_OR_SLOPED.Flat },
            { ID: 2, Description: 'Uphill', Image: this.icons.FLAT_OR_SLOPED.Uphill },
            { ID: 3, Description: 'Steep uphill', Image: this.icons.FLAT_OR_SLOPED.Steep_Uphill },
            { ID: 4, Description: 'Downhill', Image: this.icons.FLAT_OR_SLOPED.Downhill },
            { ID: 5, Description: 'Steep downhill', Image: this.icons.FLAT_OR_SLOPED.Steep_Downhill }
        ];
        this.roadSurfaceTypeOptions = () => [
            { ID: 1, Description: 'Concrete', Image: this.icons.ROAD_SURFACE_TYPES.Concrete },
            { ID: 2, Description: 'Tarmac', Image: this.icons.ROAD_SURFACE_TYPES.Tarmac },
            { ID: 3, Description: 'Gravel', Image: this.icons.ROAD_SURFACE_TYPES.Gravel },
            { ID: 4, Description: 'Dirt', Image: this.icons.ROAD_SURFACE_TYPES.Dirt },
            { ID: 5, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.roadTypeOptions = () => [
            { ID: 1, Description: 'Freeway', Image: this.icons.ROAD_TYPES.Freeway },
            { ID: 2, Description: 'On / Off ramp', Image: this.icons.ROAD_TYPES.On_Off_Ramp },
            { ID: 3, Description: 'Dual carriageway', Image: this.icons.ROAD_TYPES.Dual_Carriageway },
            { ID: 4, Description: 'Single carriageway', Image: this.icons.ROAD_TYPES.Single_Carriageway },
            { ID: 5, Description: 'One way', Image: this.icons.ROAD_TYPES.One_Way },
            { ID: 6, Description: 'Other', Image: this.icons.COMMON.Other },
            { ID: 7, Description: 'On-road parking / rank', Image: this.icons.ROAD_TYPES.On_Road_Parking_Rank },
            { ID: 8, Description: 'Off-road parking / rank', Image: this.icons.ROAD_TYPES.Off_Road_Parking_Rank }
        ];
        this.roadSurfaceConditionOptions = () => [
            { ID: 1, Description: 'Dry', Image: this.icons.ROAD_SURFACE_CONDITIONS.Dry },
            { ID: 2, Description: 'Wet', Image: this.icons.ROAD_SURFACE_CONDITIONS.Wet },
            { ID: 3, Description: 'Wet in areas', Image: this.icons.ROAD_SURFACE_CONDITIONS.Wet_In_Areas },
            { ID: 4, Description: 'Ice', Image: this.icons.ROAD_SURFACE_CONDITIONS.Ice },
            { ID: 5, Description: 'Snow', Image: this.icons.ROAD_SURFACE_CONDITIONS.Snow },
            { ID: 6, Description: 'Loose gravel or sand', Image: this.icons.ROAD_SURFACE_CONDITIONS.Loose_Gravel_Or_Sand },
            { ID: 7, Description: 'Slippery', Image: this.icons.ROAD_SURFACE_CONDITIONS.Slippery },
            { ID: 8, Description: 'Water standing', Image: this.icons.ROAD_SURFACE_CONDITIONS.Water_Standing },
            { ID: 9, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.roadQualityOptions = () => [
            { ID: 1, Description: 'Good', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'Bumpy', Image: this.icons.QUALITY_OF_ROAD.Bumpy },
            { ID: 3, Description: 'Pothole', Image: this.icons.QUALITY_OF_ROAD.Potholes },
            { ID: 4, Description: 'Cracks', Image: this.icons.QUALITY_OF_ROAD.Cracks },
            { ID: 5, Description: 'Corrugated', Image: this.icons.QUALITY_OF_ROAD.Corrugated },
            { ID: 6, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.directionOfRoadOptions = () => [
            { ID: 1, Description: 'Straight', Image: this.icons.ROAD_DIRECTIONS.Straight },
            { ID: 2, Description: 'Curving', Image: this.icons.ROAD_DIRECTIONS.Curving },
            { ID: 3, Description: 'Sharp curve', Image: this.icons.ROAD_DIRECTIONS.Sharp_Curve },
        ];
        this.juntionTypeOptions = () => [
            { ID: 7, Description: 'Not a junction or crossing', Image: this.icons.JUNCTION_TYPES.Not_A_Junction_Or_Crossing },
            { ID: 1, Description: 'Cross roads', Image: this.icons.JUNCTION_TYPES.Cross_Road },
            { ID: 2, Description: 'T-Junction', Image: this.icons.JUNCTION_TYPES.T_Junction },
            { ID: 3, Description: 'Staggered junction', Image: this.icons.JUNCTION_TYPES.Staggered_Junction },
            { ID: 4, Description: 'Y-Junction', Image: this.icons.JUNCTION_TYPES.Y_Junction },
            { ID: 5, Description: 'Circle', Image: this.icons.JUNCTION_TYPES.Circle },
            { ID: 6, Description: 'Level crossing', Image: this.icons.JUNCTION_TYPES.Level_Crossing },
            { ID: 8, Description: 'On ramp / slipway', Image: this.icons.JUNCTION_TYPES.On_Ramp_Slipway },
            { ID: 9, Description: 'Off ramp / slipway', Image: this.icons.JUNCTION_TYPES.On_Ramp_Slipway },
            { ID: 10, Description: 'Pedestrian crossing', Image: this.icons.JUNCTION_TYPES.Pedestrian_Crossing },
            { ID: 11, Description: 'Property driveway / access', Image: this.icons.JUNCTION_TYPES.Property_Driveway_Access },
            { ID: 12, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.trafficControlTypeOptions = () => [
            { ID: 1, Description: 'Robot', Image: this.icons.TRAFFIC_CONTROL_TYPES.Robot },
            { ID: 2, Description: 'Stop sign', Image: this.icons.TRAFFIC_CONTROL_TYPES.Stop_Sign },
            { ID: 3, Description: 'Yield sign', Image: this.icons.TRAFFIC_CONTROL_TYPES.Yield_Sign },
            { ID: 4, Description: 'Officer', Image: this.icons.TRAFFIC_CONTROL_TYPES.Officer },
            { ID: 5, Description: 'Officer + Robot', Image: this.icons.TRAFFIC_CONTROL_TYPES.Officer_Robot },
            { ID: 6, Description: 'Uncontrolled junction', Image: this.icons.TRAFFIC_CONTROL_TYPES.Uncontrolled_Junction },
            { ID: 7, Description: 'Not at junction, crossing or barrier line', Image: this.icons.TRAFFIC_CONTROL_TYPES.Not_A_Junction_Crossing_Or_Barrier_Line },
            { ID: 8, Description: 'All robots out of order', Image: this.icons.TRAFFIC_CONTROL_TYPES.All_Robots_Out_Of_Order },
            { ID: 9, Description: 'Some robots out of order', Image: this.icons.TRAFFIC_CONTROL_TYPES.Some_Robots_Out_Of_Order },
            { ID: 10, Description: 'Flasing robots', Image: this.icons.TRAFFIC_CONTROL_TYPES.Flashing_Robots },
            { ID: 11, Description: 'Boom', Image: this.icons.TRAFFIC_CONTROL_TYPES.Boom },
            { ID: 12, Description: 'Pedestrian crossing', Image: this.icons.TRAFFIC_CONTROL_TYPES.Pedestrian_Crossing },
            { ID: 13, Description: 'Barrier line', Image: this.icons.TRAFFIC_CONTROL_TYPES.Barrier_Line }
        ];
        this.roadMarkingVisibilityOptions = () => [
            { ID: 1, Description: 'Unknown', Image: this.icons.COMMON.Unknown },
            { ID: 2, Description: 'Not good', Image: this.icons.COMMON.Not_Good },
            { ID: 3, Description: 'Good', Image: this.icons.COMMON.Good },
            { ID: 4, Description: 'Not applicable', Image: this.icons.COMMON.Not_Applicable }
        ];
        this.roadSignConditionOptions = () => [
            { ID: 1, Description: 'Good', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'Not Good', Image: this.icons.COMMON.Not_Good },
            { ID: 3, Description: 'Damaged or Missing', Image: this.icons.CONDITION_OF_ROAD_SIGNS.Damaged_Or_Missing },
            { ID: 4, Description: 'Not Applicable', Image: this.icons.COMMON.Not_Applicable }
        ];
        this.overtakingControlOptions = () => [
            { ID: 1, Description: 'Barrier line', Image: this.icons.OVER_TAKING_CONTROLS.Barrier_Line },
            { ID: 2, Description: 'Road sign', Image: this.icons.OVER_TAKING_CONTROLS.Road_Sign },
            { ID: 3, Description: 'Not applicable', Image: this.icons.COMMON.Not_Applicable },
            { ID: 4, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.obstructionOptions = () => [
            { ID: 1, Description: 'Accident site', Image: this.icons.OBSTRUCTIONS.Accident_Site },
            { ID: 2, Description: 'Road block', Image: this.icons.OBSTRUCTIONS.Road_Block },
            { ID: 3, Description: 'Road works', Image: this.icons.OBSTRUCTIONS.Road_Works },
            { ID: 4, Description: 'None', Image: this.icons.OBSTRUCTIONS.None },
            { ID: 5, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.lightConditionOptions = () => [
            { ID: 3, Description: 'Dawn / Dusk', Image: this.icons.LIGHT_CONDITIONS.Dawn_Dusk },
            { ID: 1, Description: 'Daylight', Image: this.icons.LIGHT_CONDITIONS.Day_Light },
            { ID: 2, Description: 'Night: unlit', Image: this.icons.LIGHT_CONDITIONS.Night_Unlit },
            { ID: 4, Description: 'Night: lit', Image: this.icons.LIGHT_CONDITIONS.Night_Lit_By_Street_Light },
            { ID: 5, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.weatherConditionOptions = () => [
            { ID: 1, Description: 'Clear', Image: this.icons.WEATHER_CONDITIONS.Clear },
            { ID: 2, Description: 'Overcast', Image: this.icons.WEATHER_CONDITIONS.Overcast },
            { ID: 3, Description: 'Rain', Image: this.icons.WEATHER_CONDITIONS.Rain },
            { ID: 4, Description: 'Mist / Fog', Image: this.icons.WEATHER_CONDITIONS.Mist_Fog },
            { ID: 5, Description: 'Hail / Snow', Image: this.icons.WEATHER_CONDITIONS.Hail_Snow },
            { ID: 6, Description: 'Dust', Image: this.icons.WEATHER_CONDITIONS.Dust },
            { ID: 7, Description: 'Fire / Smoke', Image: this.icons.WEATHER_CONDITIONS.Fire_Smoke },
            { ID: 8, Description: 'Severe Winds', Image: this.icons.WEATHER_CONDITIONS.Severe_Wind },
            { ID: 9, Description: 'Unknown', Image: this.icons.COMMON.Unknown }
        ];
        this.vehicleDamageOptions = () => [
            { ID: 1, Description: 'Right front' },
            { ID: 2, Description: 'Right mid-front' },
            { ID: 3, Description: 'Right mid-back' },
            { ID: 4, Description: 'Back right' },
            { ID: 5, Description: 'Back centre' },

            { ID: 6, Description: 'Back left' },
            { ID: 7, Description: 'Left mid-back' },
            { ID: 8, Description: 'Left mid-front' },
            { ID: 9, Description: 'Left front' },
            { ID: 10, Description: 'Front centre' },

            { ID: 11, Description: 'Bonnet' },
            { ID: 12, Description: 'Roof' },
            { ID: 13, Description: 'Boot' },
            { ID: 14, Description: 'Multiple' },
            { ID: 15, Description: 'Caught fire' },

            { ID: 16, Description: 'Rolled' },
            { ID: 17, Description: 'Damage - undercarrige' },
            { ID: 18, Description: 'Damage - no detail' },
            { ID: 19, Description: 'No damage' },
            { ID: 20, Description: 'Windscreen / Windows' }
        ];
        //#endregion =========================================

        //#region ========== SCAN Options ===========
        this.raceOptions = () => [
            { ID: 1, Description: 'Asian' },
            { ID: 2, Description: 'Black' },
            { ID: 3, Description: 'Coloured' },
            { ID: 4, Description: 'White' },
            { ID: 5, Description: 'Other' },
            { ID: 6, Description: 'Unknown' },
        ];
        this.genderOptions = () => [
            { ID: 1, Description: 'Male' },
            { ID: 2, Description: 'Female' },
            { ID: 3, Description: 'Other' }
        ];
        this.licenceTypeOptions = () => [
            { ID: 1, Description: 'Drivers licence' },
            { ID: 2, Description: 'Learners licence' },
            { ID: 3, Description: 'None' }
        ];
        this.licenceCodeOptions = () => [
            { ID: 1, Description: 'A1' },
            { ID: 2, Description: 'A' },
            { ID: 3, Description: 'B' },
            { ID: 4, Description: 'C1' },
            { ID: 5, Description: 'C' },
            { ID: 6, Description: 'EB' },
            { ID: 7, Description: 'EC1' },
            { ID: 8, Description: 'EC' },
            { ID: 9, Description: 'Other' },
        ];
        this.seatbeltUsedOptions = () => [
            { ID: 1, Description: 'Yes', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'No, but it was fitted / present', Image: this.icons.GENERAL.No_But_It_Was_Fitted_Present },
            { ID: 3, Description: 'No', Image: this.icons.COMMON.Not_Good },
            { ID: 4, Description: 'Unknown', Image: this.icons.COMMON.Unknown },
        ];
        this.severityOfInjuryOptions = () => [
            { ID: 1, Description: 'Killed', Image: this.icons.SEVERITY_OF_INJURY.Killed },
            { ID: 2, Description: 'Serious', Image: this.icons.SEVERITY_OF_INJURY.Serious },
            { ID: 3, Description: 'Slight', Image: this.icons.SEVERITY_OF_INJURY.Slight },
            { ID: 4, Description: 'No injury', Image: this.icons.SEVERITY_OF_INJURY.No_Injury }
        ];
        this.liqourDrugUseOptions = () => [
            { ID: 1, Description: 'Yes', Image: this.icons.COMMON.Good },
            { ID: 2, Description: 'No, but it was suspected', Image: this.icons.GENERAL.No_But_It_Was_Suspected },
            { ID: 3, Description: 'No', Image: this.icons.COMMON.Not_Good },
            { ID: 4, Description: 'Unknown', Image: this.icons.COMMON.Unknown }

        ];
        this.locationOfPedestrianOrCyclistOptions = () => [
            { ID: 1, Description: 'Roadway', Image: this.icons.PEDESTRIAN_POSITION.Roadway },
            { ID: 2, Description: 'Sidewalk / Verge', Image: this.icons.PEDESTRIAN_POSITION.Sidewalk },
            { ID: 3, Description: 'Shoulder of road', Image: this.icons.PEDESTRIAN_POSITION.Shoulder_Of_Road },
            { ID: 4, Description: 'Median', Image: this.icons.PEDESTRIAN_POSITION.Median }
        ];
        this.whereWasPedestrianOrCyclistOptions = () => [
            { ID: 1, Description: 'Within crossed markings', Image: this.icons.PEDESTRIAN_LOCATION.Within_Marked_Crossing },
            { ID: 2, Description: 'Within 50 meters of the crossing', Image: this.icons.PEDESTRIAN_LOCATION.Withing_50m_Of_Crossing },
            { ID: 3, Description: 'Not at crossing', Image: this.icons.PEDESTRIAN_LOCATION.Not_At_Crossing }
        ];
        this.colorOfClothing = () => [
            { ID: 1, Description: 'Light', Image: this.icons.COLOUR_OF_CLOTHING.Light },
            { ID: 2, Description: 'Dark', Image: this.icons.COLOUR_OF_CLOTHING.Dark },
            { ID: 3, Description: 'Light & Dark', Image: this.icons.COLOUR_OF_CLOTHING.Light_And_Dark },
            { ID: 4, Description: 'Reflective', Image: this.icons.COLOUR_OF_CLOTHING.Reflective },
            { ID: 5, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.whatPedestrianWasDoingOptions = () => [
            { ID: 1, Description: 'Walking', Image: this.icons.PEDESTRIAN_ACTION.Walking },
            { ID: 2, Description: 'Running', Image: this.icons.PEDESTRIAN_ACTION.Running },
            { ID: 3, Description: 'Standing', Image: this.icons.PEDESTRIAN_ACTION.Standing },
            { ID: 4, Description: 'Playing', Image: this.icons.PEDESTRIAN_ACTION.Playing },
            { ID: 5, Description: 'Sitting', Image: this.icons.PEDESTRIAN_ACTION.Sitting },
            { ID: 6, Description: 'Lying down', Image: this.icons.PEDESTRIAN_ACTION.Lying },
            { ID: 7, Description: 'Working', Image: this.icons.PEDESTRIAN_ACTION.Working },
            { ID: 8, Description: 'Other', Image: this.icons.COMMON.Other }
        ];
        this.pedestrianOrCyclistManoeuvereOptions = () => [
            { ID: 1, Description: 'Facing traffic', Image: this.icons.PEDESTRIAN_MANOUEVERS.Facing_Traffic },
            { ID: 2, Description: 'Back to traffic', Image: this.icons.PEDESTRIAN_MANOUEVERS.Back_To_Traffic },
            { ID: 3, Description: 'Crossing road', Image: this.icons.PEDESTRIAN_MANOUEVERS.Crossing_Road }
        ];
        //#endregion =================================

        //#region ========== SUBMIT OPTIONS ==========
        this.trappedOfFallenOutOptions = () => [
            { ID: 1, Description: 'Trapped', Image: this.icons.TRAPPED_OR_FALLEN_OUT.Trapped },
            { ID: 2, Description: 'Fallen out', Image: this.icons.TRAPPED_OR_FALLEN_OUT.Fallen_Out },
            { ID: 3, Description: 'Not Applicable', Image: this.icons.COMMON.Not_Applicable }
        ];
        //#endregion =================================
    }
}
