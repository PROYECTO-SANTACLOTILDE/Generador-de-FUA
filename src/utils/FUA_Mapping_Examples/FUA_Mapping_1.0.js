({
    pages: [
        {
            pageNumber: 1,
            // Sections Mapping
            sections: [
                {
                    codeName: "IPRESS Data",
                    // Fields Mapping
                    fields: [                
                        {
                            // Visit Date
                            codeName: "Visit Date",
                            fieldType: "Table",
                            mappings: [
                                {
                                    // DIA
                                    target: "payload.startDatetime",
                                    column: 1,
                                    row: 2,
                                    valueType: "String",
                                    value: ["startDatetime"],
                                    extraProcessing: (value) => ( value?.substring(8, 10) || '' )                             
                                },
                                {
                                    // MES
                                    target: "payload.startDatetime",
                                    column: 2,
                                    row: 2,
                                    valueType: "String",
                                    value: ["startDatetime"],
                                    extraProcessing: (value) => ( value?.substring(5, 7) || '' )                             
                                },
                                {
                                    target: "payload.startDatetime",
                                    // AÑO
                                    column: 3,
                                    row: 2,
                                    valueType: "String",
                                    value: ["startDatetime"],
                                    extraProcessing: (value) => ( value?.substring(0, 4) || '' )                             
                                },
                            ]
                        }                        
                    ]
                }
            ]
        }
    ]
})

