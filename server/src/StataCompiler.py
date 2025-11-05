import os
import re
import pandas as pd
import pyreadstat


class StataCompiler:
    def __init__(self, dta_path=None, do_path=None):
        self.dta_path = dta_path
        self.do_path = do_path
        self.df = None
        self.var_labels = {}
        self.labels_var = {}
        self.labels = {}

    def load_data(self):
        """Load .dta file"""
        if not self.dta_path:
            raise ValueError("A .dta file path must be provided")

        self.df, _ = pyreadstat.read_dta(self.dta_path)

    # --- STEP 2: Parse .do (labels etc.) ---
    def parse_do(self):
        if not self.do_path:
            return
        with open(self.do_path) as f:
            do_script = f.read()

        # Label variable
        for m in re.finditer(r'label variable (\w+)\s+"([^"]+)"', do_script):
            var, desc = m.groups()
            if desc in self.labels_var:
                self.var_labels[var] = desc + "_" + var
                self.labels_var[desc + "_" + var] = var
            else:
                self.var_labels[var] = desc
                self.labels_var[desc] = var

        # Label define (value labels)
        label_defs = re.findall(r"label define (\w+)\s+([^;]+);", do_script)
        for label_name, defs in label_defs:
            entries = re.findall(r'(\d+)\s+"([^"]+)"', defs)
            self.labels[label_name] = {int(k): v for k, v in entries}

        # Label values (apply label set to variable)
        label_links = re.findall(r"label values (\w+)\s+(\w+)", do_script)
        for var, label in label_links:
            if var in self.df.columns and label in self.labels:
                self.df[var] = self.df[var].map(self.labels[label]).astype("category")


    def compile(self):
        self.load_data()
        self.parse_do()

        return self.df

    def __str__(self):
        return f"StataCompiler(labels={self.labels}, var_labels={self.labels_var})"


if __name__ == "__main__":
    grandparent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    base = os.path.join(grandparent_dir, "DHS Program", "SPA", "EGAN5IDTSP")
    
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
