export default function RightPanel({

    puzzle,

    correct,

    wrong,

    accuracy,

    nextPuzzle

}){

    return(

        <div
            style={{

                background:"#202020",

                color:"white",

                padding:30,

                display:"flex",

                flexDirection:"column",

                gap:25

            }}
        >

            <h1>

                Mate in One

            </h1>

            <h3>

                {

                    puzzle.fen.includes(" w ")

                    ?

                    "White to Move"

                    :

                    "Black to Move"

                }

            </h3>

            <hr/>

            <h3>

                Rating

            </h3>

            {puzzle.rating}

            <h3>

                Theme

            </h3>

            {puzzle.themes}

            <hr/>

            <h3>

                Statistics

            </h3>

            <div>

                ✅ {correct}

            </div>

            <div>

                ❌ {wrong}

            </div>

            <div>

                🎯 {accuracy}%

            </div>

            <button

                onClick={nextPuzzle}

            >

                Next Puzzle

            </button>

        </div>

    )

}