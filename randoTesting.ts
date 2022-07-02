
function dateDiffInYears(dateold: Date, datenew: Date): number {
    const yNew = datenew.getFullYear();
    const mNew = datenew.getMonth();
    const dNew = datenew.getDate();
    const yOld = dateold.getFullYear();
    const mOld = dateold.getMonth();
    const dOld = dateold.getDate();
    let diff = yNew - yOld;
    if (mOld > mNew) {
        diff--;
    } else if (mOld == mNew && dOld > dNew) {
        diff--;
    }
    return diff;
}

class Employee {
    fName?: string;
    mName?: string;
    lName?: string;
    birthDate?: Date;

    constructor(fName: string, mName: string, lName: string, birthDate: Date) {
        this.fName = fName;
        this.mName = mName;
        this.lName = lName;
        this.birthDate = birthDate;
    }

    age_in_years(): number {
        const today: Date = new Date();
        if (this.birthDate) {
            const yearsOld: number = dateDiffInYears(this.birthDate, today);
            return yearsOld;
        } else {
            return -1;
        }
    }
    print_info(): void {
        console.log(this.fName + " " +
            this.mName + " " +
            this.lName + " is " +
            this.age_in_years() + " years old.");
    }
}

function test(): void {
    const emp: Employee = new Employee("Barry", "C", "Smith", new Date("2/1/1970"));
    emp.print_info();

    const save_result = save_emp(emp);
    if (save_result === "success") {
        console.log('yay!');
    } else {
        console.log('error!');
    }
}
test();

function save_emp(emp: Employee): string {
    console.log("saving employee " + emp.lName);
    return "success";
}