'use client'
import { useDB, useDBQuery } from '@/hooks/useDB';
import useSave from '@/hooks/useSave';
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export function MyDropzone() {
    const [rawSaveFile, setRawSaveFile] = useState<ArrayBuffer>();
    const { dbData, writeDb } = useSave(rawSaveFile);
    const { db, run, runWithPrepare } = useDB(dbData);
    const [miscDataDynamicQuery] = useState("SELECT DataValue FROM MiscDataDynamic WHERE DataName ='ExperiencePoints' OR DataName ='PlayerFirstName' OR DataName ='PlayerLastName' OR DataName ='BaseInventoryCapacity';");
    const [inentoryDynamicQuery] = useState("SELECT Count FROM InventoryDynamic WHERE CharacterID = 'Player0' AND ItemID = 'Knuts';");

    const { results: miscDataDynamicResults, update: updateMiscDataDynamicResults } = useDBQuery(db, miscDataDynamicQuery);
    const { results: inventoryDynamicResults, update: updateInventoryDynamicResults } = useDBQuery(db, inentoryDynamicQuery);

    const [inputXp, setInputXp] = useState(0);
    const [inputFirstName, setInputFirstName] = useState("");
    const [inputLastName, setInputLastName] = useState("");
    const [inputInventorySize, setInputInventorySize] = useState(0);
    const [inputGalleons, setInputGalleons] = useState(0);

    const newSaveFileName = "HL-NEW.sav";

    const exportSave = useCallback(() => {
        // @ts-ignore
        const exportedDb = db.export();
        if (exportedDb) {
            const newSave = writeDb(exportedDb);
            const blob = new Blob([newSave]);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = newSaveFileName;
            link.click();
        }
    }, [db, writeDb]);

    // Update the results when the query changes
    useEffect(() => {
        if (miscDataDynamicResults) {
            setInputXp(parseInt(miscDataDynamicResults[0].values[0][0]));
            setInputFirstName(miscDataDynamicResults[0].values[1][0]);
            setInputLastName(miscDataDynamicResults[0].values[2][0]);
            setInputInventorySize(parseInt(miscDataDynamicResults[0].values[3][0]));
        }

    }, [miscDataDynamicResults]);

    // Update the results when the query changes
    useEffect(() => {
        if (inventoryDynamicResults)
            setInputGalleons(parseInt(inventoryDynamicResults[0].values[0][0]));
    }, [inventoryDynamicResults]);

    const saveAndExport = useCallback(async () => {
        await runWithPrepare(`UPDATE "MiscDataDynamic" SET "DataValue" = :newExperiencePoints WHERE "DataName" = "ExperiencePoints";`, {
            ':newExperiencePoints': inputXp,
        });
        await runWithPrepare(`UPDATE "MiscDataDynamic" SET "DataValue" = :newPlayerFirstName WHERE "DataName" = "PlayerFirstName";`, {
            ':newPlayerFirstName': inputFirstName,
        });
        await runWithPrepare(`UPDATE "MiscDataDynamic" SET "DataValue" = :newPlayerLastName WHERE "DataName" = "PlayerLastName";`, {
            ':newPlayerLastName': inputLastName,
        });
        await runWithPrepare(`UPDATE "MiscDataDynamic" SET "DataValue" = :newBaseInventoryCapacity WHERE "DataName" = "BaseInventoryCapacity";`, {
            ':newBaseInventoryCapacity': inputInventorySize,
        });
        await runWithPrepare(`UPDATE "InventoryDynamic" SET "Count" = :newKnutsCount WHERE "CharacterID" = "Player0" AND "ItemID" = "Knuts";`, {
            ':newKnutsCount': inputGalleons,
        });

        await exportSave();
    }, [run, exportSave, inputFirstName, inputGalleons, inputInventorySize, inputLastName, inputXp]);

    const saveTheButterfliesAndExport = useCallback(async () => {
        const commandList = [
            `DELETE FROM "main"."EconomicExpiryDynamic" WHERE UniqueID = '6B564A7340A0AC3DCDBFD3913BFBA38A';`,
            `DELETE FROM "main"."EconomicExpiryDynamic" WHERE UniqueID = '3C3836154F9DD64C7F89E0A62B51A77C';`,
            `DELETE FROM "main"."EconomicExpiryDynamic" WHERE UniqueID LIKE '%.EE00792C_LootDrop';`,

            `UPDATE "main"."StatsDynamic" SET Value = Value - 1 WHERE StatID = "MissionsCompleted";`,

            `UPDATE "main"."StatsDynamic" SET Value = 0 WHERE StatID = "M_COM_11_ChestCollected";`,
            `UPDATE "main"."StatsDynamic" SET Value = -1 WHERE StatID = "M_COM_11_ClemTruth";`,

            `DELETE FROM "main"."MissionDynamic" WHERE MissionID = 'COM_11';`,
            `INSERT INTO "main"."MissionDynamic" ("MissionID", "Type", "Text1", "Text2", "Text3", "Text4", "Text5", "Text6", "Integer1", "Integer2", "Integer3", "Integer4", "Integer5", "Integer6", "Integer7") VALUES ('COM_11', 'MissionEntryPoint', 'Quest', '', 'ClementineWillardsey', 'Never', 'None', '', '0', '0', '1', '0', '0', '5', '');`,
            `INSERT INTO "main"."MissionDynamic" ("MissionID", "Type", "Text1", "Text2", "Text3", "Text4", "Text5", "Text6", "Integer1", "Integer2", "Integer3", "Integer4", "Integer5", "Integer6", "Integer7") VALUES ('COM_11', 'StepJournal', 'COM_11_ButterfliesInMyStomach_QuestAvailable_JournalRollover', '', '', '', '', '', '', '', '', '', '', '', '');`,
            `INSERT INTO "main"."MissionDynamic" ("MissionID", "Type", "Text1", "Text2", "Text3", "Text4", "Text5", "Text6", "Integer1", "Integer2", "Integer3", "Integer4", "Integer5", "Integer6", "Integer7") VALUES ('COM_11', 'SublevelBoundary', 'M_COM_11_Intro', 'Overland', 'MEP_COM_11', '', '', '', '2500', '4000', '1', '0', '', '', '');`,
            `INSERT INTO "main"."MissionDynamic" ("MissionID", "Type", "Text1", "Text2", "Text3", "Text4", "Text5", "Text6", "Integer1", "Integer2", "Integer3", "Integer4", "Integer5", "Integer6", "Integer7") VALUES ('COM_11', 'ScheduleOverride', 'ClementineWillardsey', 'Overland', 'COM_11_HMInside3Broomsticks', 'M_COM_11_ThreeBroomsticks', '', 'StudentApparateOut_Default', '0', '0', '', '', '', '', '');`,
            `INSERT INTO "main"."MissionDynamic" ("MissionID", "Type", "Text1", "Text2", "Text3", "Text4", "Text5", "Text6", "Integer1", "Integer2", "Integer3", "Integer4", "Integer5", "Integer6", "Integer7") VALUES ('COM_11', 'Main', 'TalkTo-Clementine', 'PreActive', '', '', '', '', '423918', '0', '0', '0', '1', '423918', '');`,
        ];

        commandList.forEach(async (command) => {
            await run(command);
        });

        await saveAndExport();
    }, [run, saveAndExport, inputFirstName, inputGalleons, inputInventorySize, inputLastName, inputXp]);
    
    const saveTheBiscuitAndExport = useCallback(async () => {
        command = `DELETE FROM "main"."LockableComponentsDynamic" WHERE ID like '%MoonCalfCage_0.Padlock%';`
        
        await run(command);

        await saveAndExport();
    }, [run, saveAndExport, inputFirstName, inputGalleons, inputInventorySize, inputLastName, inputXp]);

    const onDrop = useCallback((acceptedFiles: any[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                if (binaryStr instanceof ArrayBuffer)
                    setRawSaveFile(binaryStr);
            }
            reader.readAsArrayBuffer(file)
        })

    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return <div>

        <div className={`w-full ${!miscDataDynamicResults ? 'hidden' : ''}`}>
            {/* Player XP */}
            <label className="label">
                <span className="label-text">Player XP</span>
            </label>
            <input type="number" placeholder="Type here" className="input input-bordered w-full" value={inputXp} onChange={e => setInputXp(parseInt(e.target.value))} />
            {/* Player first name */}
            <label className="label">
                <span className="label-text">Player first name</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full" value={inputFirstName} onChange={e => setInputFirstName(e.target.value)} />
            {/* Player last name */}
            <label className="label">
                <span className="label-text">Player last name</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full" value={inputLastName} onChange={e => setInputLastName(e.target.value)} />
            {/* Player inventory size */}
            <label className="label">
                <span className="label-text">Player inventory size</span>
            </label>
            <input type="number" placeholder="Type here" className="input input-bordered w-full" value={inputInventorySize} onChange={e => setInputInventorySize(parseInt(e.target.value))} />
            { /* Galleons */}
            <label className="label">
                <span className="label-text">Galleons</span>
            </label>
            <input type="number" placeholder="Type here" className="input input-bordered w-full" value={inputGalleons} onChange={e => setInputGalleons(parseInt(e.target.value))} />
            {/* Save and export */}
            < button className="btn btn-primary mt-6 w-full" onClick={saveAndExport}>Save and export</button>
            < button className="btn btn-primary mt-6 w-full" onClick={saveTheButterfliesAndExport}>Save the butterflies</button>
            < button className="btn btn-primary mt-6 w-full" onClick={saveTheBiscuitAndExport}>Save the Biscuit</button>

        </div>

        <div className={`${miscDataDynamicResults ? 'hidden' : ''}`} {...getRootProps()} >
            <input {...getInputProps()} />
            <div className="border-dashed border-2 h-32 rounded justify-center items-center mt-10 cursor-pointer">
                <span className="block text-grey flex mx-auto justify-center pt-12">Drop your save files here</span>
                
            </div>
            
            <p>You save game location might be %appdata%\..\Local\Hogwarts Legacy\Saved\SaveGames\YOUR ID\</p>

        </div>

    </div>


}
