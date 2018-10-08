import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;

public class eps {

    public static void main(String args[]) throws Exception {

        String bseCode = "500002" ;

        File f = new File("//home//kjsce//Desktop//stocks1//" + bseCode + ".xlsx");
        FileInputStream fis = new FileInputStream(f);
        // Blank workbook
        XSSFWorkbook wb = new XSSFWorkbook(fis);
        XSSFSheet s1 = wb.getSheetAt(0);

        System.out.println(s1.getRow(12).getCell(0));


        // Create a blank sheet
        //XSSFSheet sheet = workbook.createSheet("student Details");
    }

}
