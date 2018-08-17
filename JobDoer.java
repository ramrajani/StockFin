package Practice;


import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;

import java.io.*;
import java.util.Iterator;

public class JobDoer {
    static  PrintWriter pw;
    public static  void main(String args[]) throws Exception {

        readThenWriteJSON("C:\\Users\\Tushar\\IdeaProjects\\JavaCP\\src\\Practice\\stockjson1.json");
        pw.flush();
        pw.close();


    }
    static void readThenWriteJSON(String name) throws Exception{
            Object obj = new JSONParser().parse(new FileReader(name));


        JSONObject jo=(JSONObject)obj;
        JSONArray companyList = (JSONArray) jo.get("pusharray");

        Iterator it=companyList.iterator();
        while(it.hasNext()){
            JSONObject companyObject=(JSONObject) it.next();
            JSONObject editedCompany=new JSONObject();
            editedCompany.put("name",companyObject.get("sharename"));
            editedCompany.put("bse",companyObject.get("bse"));
            editedCompany.put("nse",companyObject.get("nse"));


            String code=(String)companyObject.get("bse");
            pw = new PrintWriter("C:\\Users\\Tushar\\IdeaProjects\\JavaCP\\src\\Practice\\output\\"+code+".json");

            addExcelData(editedCompany);
            pw.write(editedCompany.toJSONString());


            break;

        }


    }
    static void addExcelData(JSONObject editedCompany) throws  Exception{
    String bseCode=(String)editedCompany.get("bse");
        File f=new File("C:\\Users\\Tushar\\IdeaProjects\\JavaCP\\src\\Practice\\stocks1\\"+bseCode+".xlsx");
        FileInputStream fis=new FileInputStream(f);
        XSSFWorkbook wb = new XSSFWorkbook(fis);
        XSSFSheet s1=wb.getSheetAt(5);

    addData( editedCompany,s1, "ProfitLoss", 16, 31 );
    addData( editedCompany,s1, "Quarters", 41, 50 );
    addData( editedCompany,s1, "BalanceSheet", 56, 72 );
    addData( editedCompany,s1, "CashFlow", 81, 85 );













    }
    static void  addData(JSONObject editedCompany,XSSFSheet s1,String parameter,int start,int end){
        JSONObject year=new JSONObject();
        int ind=1;
        while(true) {
            String date="";
            try {
                date = s1.getRow(start-1).getCell(ind).toString();
                int len=date.length();
                date=date.substring(len-4,len);
            }
            catch (Exception e){
                break;
            }
            JSONArray ja = new JSONArray();
            for (int i = start; i < end; ++i) {
                String element;
                try {
                    element = s1.getRow(i).getCell(ind).toString();

                } catch (Exception e) {
                    element = "null";
                }
                ja.add(element);

            }
            year.put(date, ja);

            ind++;


        }


        editedCompany.put(parameter, year);


    }


}
