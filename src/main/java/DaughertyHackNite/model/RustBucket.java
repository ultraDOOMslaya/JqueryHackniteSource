package DaughertyHackNite.model;

/**
 * Created by daugherty on 4/18/16.
 */
public class RustBucket {

    public RustBucket(String name, String modelnumber, String component, String maker) {
        this.name = name;
        this.modelnumber = modelnumber;
        this.component = component;
        this.maker = maker;
    }

    private String name;
    private String modelnumber;
    private String component;
    private String maker;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getModelnumber() {
        return modelnumber;
    }

    public void setModelnumber(String modelnumber) {
        this.modelnumber = modelnumber;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public String getMaker() {
        return maker;
    }

    public void setMaker(String maker) {
        this.maker = maker;
    }
}
