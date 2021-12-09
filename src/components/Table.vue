<template>
    <div class="panel-body">
        <table class="table-latitude">
            <thead>
                <tr>
                    <th>svID</th>
                    <th>sourceName</th>
                    <th>sourceStart</th>
                    <th>sourceStop</th>
                    <th>strand</th>
                    <th>targetName</th>
                    <th>targetStart</th>
                    <th>targetStop</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in source" :key="t.id">
                    <td>{{t.svID}}</td>
                    <td>{{t.sourceName}}</td>
                    <td>{{t.sourceStart}}</td>
                    <td>{{t.sourceStop}}</td>
                    <td>{{t.strand}}</td>
                    <td>{{t.targetName}}</td>
                    <td>{{t.targetStart}}</td>
                    <td>{{t.targetStop}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>


export default {
  name: "Table",
  props: [
    "source",
  ],  
};
</script>

<style lang="scss" scoped>
$lfs-blue: #074a85;
$lfs-grey: #232324;

.table-latitude {
    width: 100%;
    thead {
        th {
            text-transform: uppercase;
            text-align: center;
            padding: 10px;
            color: $lfs-blue;
            border: 1px solid #dbd3d3;
        }
    }
    tbody {
        tr {
            border-bottom: 1px solid #F1F1F1;
            color: $lfs-grey;
            td {
                padding: 10px;
                border: 1px solid #F1F1F1;
            }
            th {
                padding-left: 10px;
                border: 1px solid #F1F1F1;
            }
        }
    }
}

</style>
