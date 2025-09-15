import { Sequelize } from 'sequelize';

// Import all entities


import Visit from './VisitModel';
import User from './User';

import FUAFormat from './FUAFormatModel';
import FUAPage from './FUAPageModel';
import FUASection from './FUASectionModel'; 
import FUAField from './FUAFieldModel';
import FUAFieldColumn from './FUAFieldColumn';
import FUAFieldRow from './FUAFieldRow';
import FUAFieldCell from './FUAFieldCell';

import FUAFromVisit from './FUAFromVisit.js';

import BaseEntityVersionModel from "./BaseEntityVersionModel.js";


// Foreign keys

FUAFormat.hasMany(FUAPage, {
    foreignKey: {
        name: 'FUAFormatId',
        allowNull: false,
    }    
});
FUAPage.belongsTo(FUAFormat);

FUAPage.hasOne(FUAPage, { foreignKey: 'nextPage' });
FUAPage.hasOne(FUAPage, { foreignKey: 'previousPage' });

FUAPage.hasMany(FUASection, {
    foreignKey: {
        name: 'FUAPageId',
        allowNull: false,
    }
});
FUASection.belongsTo(FUAPage);

FUASection.hasMany(FUAField, {
    foreignKey: {
        name: 'FUASectionId',
        allowNull: false,
    }
});
FUAField.belongsTo(FUASection);

FUAField.hasMany(FUAFieldColumn, {
    foreignKey: {
        name: 'FUAFieldId',
        allowNull: false,
    }
});
FUAFieldColumn.belongsTo(FUAField);

FUAFieldColumn.hasMany(FUAFieldRow, {
    foreignKey: {
        name: 'FUAFieldColumnId',
        allowNull: false,
    }
});
FUAFieldRow.belongsTo(FUAFieldColumn);

FUAFieldRow.hasMany(FUAFieldCell, {
    foreignKey: {
        name: 'FUAFieldRowId',
        allowNull: false,
    }
});
FUAFieldCell.belongsTo(FUAFieldRow);

FUAFieldCell.hasMany(FUAField, {
    foreignKey: {
        name: 'FUAFieldCellId',
    }
});
FUAField.belongsTo(FUAFieldCell);

BaseEntityVersionModel.belongsToMany(BaseEntityVersionModel, { 
    as: 'VersioningRelation',    
    through: 'BaseEntityVersion_Middle',
    foreignKey: 'baseEntityId',
    otherKey: 'relatedEntityId', // FK in the join table pointing to the related model
    allowNull: true,
});


//Exports
export {    
    User,
    Visit,
    FUAFormat,
    FUAPage,
    FUASection,
    FUAField,
    FUAFieldColumn,
    FUAFieldRow,
    FUAFieldCell,
    FUAFromVisit,
    BaseEntityVersionModel
};
