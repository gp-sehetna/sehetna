import os
import pandas as pd

from src.StataCompiler import StataCompiler


def main():
    base = os.path.join(".", "DHS Program", "SPA", "EGAN5IDTSP")
    file_name = "EGAN5IFLSP"
    dta_file_path = os.path.join(base, f"{file_name}.DTA")
    do_file_path = os.path.join(base, f"{file_name}.DO")

    compiler = StataCompiler(
        dta_path=dta_file_path,
        do_path=do_file_path
    )

    df = compiler.compile()
    print(df[compiler.labels_var["Governorate"]].unique())
    print(df[compiler.labels_var["Provider asked about Any PRIOR STILLBIRTH(S)"]].unique())



if __name__ == "__main__":
    main()
