import { useCallback, useEffect, useState } from "react"

export function useDB(data: ArrayBuffer | undefined) {
    const [engine, setEngine] = useState(null)
    const [db, setDB] = useState(null)
    const [windowWatcher, setWindowWatcher] = useState(false);
    const [loadedData, setLoadedData] = useState(false);

    useEffect(() => {
        if (window) {
            console.log("Running in a browser, checking for loadSQL")

            const timer = setInterval(() => {
                console.log("Polling...");

                // @ts-ignore
                if (window.loadSQL) {
                    console.log("Clearing timer")
                    clearInterval(timer);
                    setWindowWatcher(true)
                }
            }, 500)
        }
    }, [])

    useEffect(() => {
        console.log("Looking for loadSQL")
        // @ts-ignore
        if (window.loadSQL) {
            console.log("Should try initSQLJS")
            // @ts-ignore
            window.loadSQL().then((db) => {
                console.log("I have the database")
                setEngine(db)
            })
        }
        return () => { }
    }, [windowWatcher])

    useEffect(() => {
        if (engine && data && !loadedData) {
            console.log("Starting up the engine")

            // @ts-ignore
            setDB(new engine.Database(new Uint8Array(data)))
            setLoadedData(true);
        }

        // return () => {
        //     setDB(null)
        // }
    }, [data, engine, loadedData])

    const run = useCallback((query: string) => {
        if (!db) return null;
        console.log(`Running query ${query}`)
        // @ts-ignore
        return db.run(query);
    }, [db]);

    const runWithPrepare = useCallback((query: string, params: object) => {
        if (!db) return null;
        console.log(`Running query ${query}`)
        // @ts-ignore
        const stmt = db.prepare(query);
        const result = stmt.getAsObject(params);
        stmt.free();
        return result;

    }, [db]);


    return { db, run, runWithPrepare };
}

export function useDBQuery(db: any, query: any) {
    const [results, setResults] = useState<null | any>(null)

    useEffect(() => {
        console.log(db);
        if (db) {
            console.log(`Running query ${query}`)
            const r = db.exec(query)
            console.log(r)
            // @ts-ignore
            window.results = r;
            setResults(r)
        }
    }, [db, query])

    const update = useCallback(() => {
        if (!db) return null;
        console.log(`Running query ${query}`)
        // @ts-ignore

        const r = db.exec(query)
        console.log(r)
        // @ts-ignore
        window.results = r;
        setResults(r)
    }, [db, query]);


    return { results, update };
}