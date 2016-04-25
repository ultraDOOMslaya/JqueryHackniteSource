package DaughertyHackNite.controller;

import DaughertyHackNite.model.RustBucket;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by daugherty on 4/17/16.
 */
@Controller
public class RustBucketController {

    @RequestMapping("/rustybuckets")
    public String displayRustBucket() {
        return "RustBucket";
    }

    @RequestMapping(value = "/rustbuckets", method = RequestMethod.GET)
    @ResponseBody
    public List<RustBucket> rustBuckets() {
        List<RustBucket> rustBuckets = new ArrayList<>();
        rustBuckets.add(new RustBucket("Garbage Collecta", "000", "Hacksaw", "Orks"));
        rustBuckets.add(new RustBucket("Cigerrete Lita", "001", "Kerosene", "TheSouth"));
        rustBuckets.add(new RustBucket("Spitball Shoota", "002", "Kinetic Propulsion", "AChild"));
        rustBuckets.add(new RustBucket("Dog Chaysa", "003", "Wheels", "PetCoINC"));
        rustBuckets.add(new RustBucket("Elektrik Generata", "004", "Elektrikity", "DontSueUsINC"));
        rustBuckets.add(new RustBucket("Catapulta", "005", "Rocks", "1100AD"));
        rustBuckets.add(new RustBucket("Roket Launcha", "006", "Shrapnel", "Orks"));
        rustBuckets.add(new RustBucket("Gallon'O Oil", "007", "Sludge", "BP"));
        rustBuckets.add(new RustBucket("DumpTruk", "008", "Wheels Kinda", "Orks"));
        rustBuckets.add(new RustBucket("Salt'N Peppa", "009", "Allergin", "TheSouth"));
        rustBuckets.add(new RustBucket("Mine Cart", "011", "Black Lung", "BP"));
        rustBuckets.add(new RustBucket("Corn", "012", "Cattle Feed", "Iowa"));
        rustBuckets.add(new RustBucket("Robot ARM", "013", "Bionics", "DontSueUsInc"));
        rustBuckets.add(new RustBucket("Nerf Gun", "014", "Spook Scott!", "RicksDesk"));
        rustBuckets.add(new RustBucket("Rampant Infection", "015", "Waste of PTO", "AChild"));

        return rustBuckets;
    }

    @RequestMapping("/rustbucketsko")
    public String displayRustBucketKO() {
        return "RustBucketKO";
    }


    @RequestMapping("/makebucket")
    public String newRustBucket() { return "MakeRustBucket"; }

    @RequestMapping("/userbucket")
    public String searchRustBucket() { return "SearchRustBucket"; }
}
